import torch
import pymongo
import pandas as pd
from dataset_gen import run_process
from utils import * 
from pymongo import MongoClient
from flask import Flask, request, jsonify
from train import train
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

THRESHOLD = 1

client = MongoClient("mongodb+srv://raudyb02:333L4tU6wRB6yyRS@user.chiq7.mongodb.net/servicenow", server_api=pymongo.server_api.ServerApi(
version="1", strict=True, deprecation_errors=True))
db = client['servicenow']
companies_collection = db['Company']
industries_collection = db['Industry']  
products_collection = db['Product']
product_company_collection = db['ProductOnCompany']

def get_company_info(company_name):
    try:
        company = companies_collection.find_one({"companyName": company_name})
        industry_id = company['industryId']
        company_id = company['_id']
        industry = industries_collection.find_one({"_id": industry_id})["name"]
        
        company_products = list(product_company_collection.find({"companyId": company_id}))
        product_ids = [x["productId"] for x in company_products]
        product_names = [products_collection.find_one({"_id": x})["name"] for x in product_ids]
        product_categories = [products_collection.find_one({"_id": x})["category"] for x in product_ids]
        product_is_implemented = [x["implemented"] for x in company_products]

        return industry, product_names, product_categories, product_is_implemented

    except Exception as e:
        raise Exception(
            "The following error occurred: ", e)

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
    
    industry_map, product_name_map, product_category_map = label_to_idx()
    train(product_name_map, product_category_map, industry_map, epochs=20)

@app.route('/get_recommendations', methods=['POST'])
async def get_recommendations():
    data = request.get_json()
    company_name = data["company_name"]
    industry, names, categories, is_implemented = get_company_info(company_name)

    gen_csvs()
    run_process()

    industry_map, product_name_map, product_category_map = label_to_idx()
    # print(industry_map)
    train(product_name_map, product_category_map, industry_map, epochs=1)
    product_name_len, product_category_len, industry_len = len(product_name_map), len(product_category_map), len(industry_map)

    industry = torch.tensor(industry_map[industry]).to(device).view((1, 1)).to(device)

    product_names = torch.tensor([[product_name_map[y] for y in names]]).long().to(device)
    product_names = pad_sequence(product_names, batch_first=True, padding_value=product_name_len)

    product_categories = torch.tensor([[product_category_map[y] for y in categories]]).long().to(device)
    product_categories = pad_sequence(product_categories, batch_first=True, padding_value=product_category_len)

    product_is_implemented = torch.tensor([[y for y in is_implemented]]).long().to(device)
    product_is_implemented = pad_sequence(product_is_implemented, batch_first=True, padding_value=2)

    model = RecommenderModel(industry_len, product_name_len, product_category_len).to(device)
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
    
    return jsonify({"accelerators": accelerators})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)