import torch
import pymongo
import pandas as pd
from dataset_gen import run_process
from utils import * 
from pymongo import MongoClient
from flask import Flask, request, jsonify
from train import train

app = Flask(__name__)
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

THRESHOLD = 1

client = MongoClient("mongodb+srv://raudyb02:333L4tU6wRB6yyRS@user.chiq7.mongodb.net/servicenow", server_api=pymongo.server_api.ServerApi(
version="1", strict=True, deprecation_errors=True))
db = client['servicenow']
companies_collection = db['Company']
industries_collection = db['Industry']  
products_collection = db['Product']
product_company_collection = db['ProductOnCompany']

def gen_csvs():
    companies_data = list(companies_collection.find())
    industries_data = {str(ind['_id']): ind['name'] for ind in industries_collection.find()}
    company_dict = {
        str(comp['_id']): {
            "Name": comp['companyName'],
            "Industry": industries_data.get(str(comp['industryId']), "Unknown Industry")
        }
        for comp in companies_data
    }

    companies_df = pd.DataFrame(company_dict.values())
    companies_df.to_csv('data/companies.csv', index=False)

    product_dict = {
        str(prod['_id']): {
            "Category": prod['category'],
            "Name": prod['name'],
            "Description": prod['description']
        }
        for prod in products_collection.find()
    }

    products_df = pd.DataFrame(product_dict.values())
    products_df.to_csv('data/products.csv', index=False)

    entitlements_data = []
    for product_company in product_company_collection.find():
        product_id = str(product_company['productId'])
        company_id = str(product_company['companyId'])

        product = product_dict.get(product_id)
        company = company_dict.get(company_id)

        if product and company:
            entitlements_data.append({
                "Company": company['Name'],
                "Implemented": "TRUE" if product_company['implemented'] else "FALSE",
                "Product": product['Name']
            })

    entitlements_df = pd.DataFrame(entitlements_data)
    entitlements_df.to_csv('data/entitlements.csv', index=False)

@app.route('/add_product', methods=['POST'])
async def add_product():    
    gen_csvs()
    run_process()
    
    product_name_map, product_category_map, industry_map = label_to_idx()
    train(product_name_map, product_category_map, industry_map, epochs=20)

@app.route('/get_recommendations', methods=['POST'])
async def get_recommendations():
    data = request.get_json()
    industry = data["industry"]
    names = data["product_names"]
    categories = data["product_categories"]
    is_implemented = data["product_is_implemented"]
       
    gen_csvs()
    run_process()

    product_name_map, product_category_map, industry_map = label_to_idx()
    train(product_name_map, product_category_map, industry_map, epochs=1)
    product_name_len, product_category_len, industry_len = len(product_name_map), len(product_category_map), len(industry_map)

    industry = torch.tensor(industry_map[industry]).to(device).view((1, 1))

    product_names = torch.tensor([[product_name_map[y] for y in names]])
    product_names = pad_sequence(product_names, batch_first=True, padding_value=product_name_len).to(device)

    product_categories = torch.tensor([[product_category_map[y] for y in categories]])
    product_categories = pad_sequence(product_categories, batch_first=True, padding_value=product_category_len).to(device)

    product_is_implemented = torch.tensor([[y for y in is_implemented]]).long()
    product_is_implemented = pad_sequence(product_is_implemented, batch_first=True, padding_value=2).to(device)

    model = RecommenderModel(industry_len, product_name_len, product_category_len)
    model.load_state_dict(torch.load('model.pth', weights_only=True))
    model.eval()

    with torch.inference_mode():
        output = model(industry, product_names, product_categories, product_is_implemented)

    output_labels = list(product_name_map.keys())

    # TODO change threshold if needed
    output_labels = [name for score, name in sorted(zip(output.squeeze().cpu().numpy(), output_labels), reverse=True) if score > THRESHOLD]

    accelerators = []

    for label in output_labels:
        if label in names and is_implemented[names.index(label)]:
            accelerators.append([label, 'TuneUp'])
        else:
            accelerators.append([label, 'JumpStart'])
    
    return jsonify({"accelerators": accelerators})

def test():
    company_name = "Zen Zoology"

    companies = pd.read_csv('data/companies.csv')
    entitlements = pd.read_csv('data/entitlements.csv')
    products_df = pd.read_csv('data/products.csv')

    def get_industry_by_company_name(df, company_name):
        row = df[df['Name'] == company_name]
        if not row.empty:
            return row['Industry'].values[0]
        return None

    def get_products_by_company_name(df, company_name):
        company_data = df[df['Company'] == company_name]

        return company_data['Product'].values, company_data['Implemented']

    def get_category_by_name(df, name):
        row = df[df['Name'] == name]
        if not row.empty:
            return row['Category'].values[0]
        return None

    industry = get_industry_by_company_name(companies, company_name)
    names, is_implemented = get_products_by_company_name(entitlements, company_name)
    names, is_implemented = names.tolist(), is_implemented.tolist()
    categories = [get_category_by_name(products_df, name) for name in names]

    industry_map, product_name_map, product_category_map = label_to_idx()
    product_name_len, product_category_len = len(product_name_map), len(product_category_map)

    industry = torch.tensor(industry_map[industry]).to(device).view((1, 1))

    gen_csvs()
    run_process()

    train(product_name_map, product_category_map, industry_map, epochs=1)

    product_name_len, product_category_len, industry_len = len(product_name_map), len(product_category_map), len(industry_map)

    product_names = torch.tensor([[product_name_map[y] for y in names]])
    product_names = pad_sequence(product_names, batch_first=True, padding_value=product_name_len).to(device)

    product_categories = torch.tensor([[product_category_map[y] for y in categories]])
    product_categories = pad_sequence(product_categories, batch_first=True, padding_value=product_category_len).to(device)

    product_is_implemented = torch.tensor([[y for y in is_implemented]]).long()
    product_is_implemented = pad_sequence(product_is_implemented, batch_first=True, padding_value=2).to(device)

    model = RecommenderModel(industry_len, product_name_len, product_category_len)
    model.load_state_dict(torch.load('model.pth', weights_only=True))
    model.eval()

    with torch.inference_mode():
        output = model(industry, product_names, product_categories, product_is_implemented)

    output_labels = list(product_name_map.keys())

    output_labels = [name for _, name in sorted(zip(output.squeeze().cpu().numpy(), output_labels), reverse=True)]
    accelerators = []

    for label in output_labels:
        if label in names and is_implemented[names.index(label)]:
            accelerators.append([label, 'TuneUp'])
        else:
            accelerators.append([label, 'JumpStart'])

    print(accelerators)

# test()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)