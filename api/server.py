import torch
import pymongo
import pandas as pd
from utils import * 
from pymongo import MongoClient
from flask import Flask, request, jsonify, send_file
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


# industry_map, product_name_map, product_category_map = label_to_idx()
# industry_len, product_name_len, product_category_len = len(industry_map), len(product_name_map), len(product_category_map)

# company_name = "Zen Zoology"

# companies = pd.read_csv('data/companies.csv')
# entitlements = pd.read_csv('data/entitlements.csv')
# products_df = pd.read_csv('data/products.csv')

# def get_industry_by_company_name(df, company_name):
#     row = df[df['Name'] == company_name]
#     if not row.empty:
#         return row['Industry'].values[0]
#     return None

# def get_products_by_company_name(df, company_name):
#     company_data = df[df['Company'] == company_name]

#     return company_data['Product'].values, company_data['Implemented']

# def get_category_by_name(df, name):
#     row = df[df['Name'] == name]
#     if not row.empty:
#         return row['Category'].values[0]
#     return None

# industry = get_industry_by_company_name(companies, company_name)
# names, implemented = get_products_by_company_name(entitlements, company_name)
# names, implemented = names.tolist(), implemented.tolist()
# categories = [get_category_by_name(products_df, name) for name in names]

# product_name_len, product_category_len = len(product_name_map), len(product_category_map)

# industry = torch.tensor(industry_map[industry]).to(device).view((1, 1))

# product_names = torch.tensor([[product_name_map[y] for y in names]])
# product_names = pad_sequence(product_names, batch_first=True, padding_value=product_name_len).to(device)

# product_categories = torch.tensor([[product_category_map[y] for y in categories]])
# product_categories = pad_sequence(product_categories, batch_first=True, padding_value=product_category_len).to(device)

# product_is_implemented = torch.tensor([[y for y in implemented]]).long()
# product_is_implemented = pad_sequence(product_is_implemented, batch_first=True, padding_value=2).to(device)

# model = RecommenderModel(industry_len, product_name_len, product_category_len)
# model.load_state_dict(torch.load('model.pth', weights_only=True))
# model.eval()

# with torch.inference_mode():
#     output = model(industry, product_names, product_categories, product_is_implemented)

# output_labels = list(product_name_map.keys())
# output_labels = [x for _, x in sorted(zip(output.squeeze().cpu().numpy(), output_labels), reverse=True)]

# print(f'Output: {output_labels}')

def label_to_idx_maps():
    products = {}
    categories = {}
    category_index = 0

    for idx, doc in enumerate(products_collection.find({}, {'name': 1, 'category': 1})):
        products[doc['name']] = idx
        if doc['category'] not in categories:
            categories[doc['category']] = category_index
            category_index += 1

    industries = {doc['name']: idx for idx, doc in enumerate(industries_collection.find({}, {'name': 1}))}
   
    return products, categories, industries


@app.route('/add_product', methods=['POST'])
async def add_product():
    #TODO mongodb retrieval dataset

    product_name_map, product_category_map, industry_map = label_to_idx_maps()
    train(product_name_map, product_category_map, industry_map)

@app.route('/get_recommendations', methods=['POST'])
async def get_recommendations():
    data = request.get_json()
    industry = data["industry"]
    names = data["product_names"]
    categories = data["product_categories"]
    is_implemented = data["product_is_implemented"]

    product_name_map, product_category_map, industry_map = label_to_idx_maps()
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

    # change threshold if needed
    output_labels = [name for score, name in sorted(zip(output.squeeze().cpu().numpy(), output_labels), reverse=True) if score > THRESHOLD]

    accelerators = []

    for label in output_labels:
        if label in names and is_implemented[names.index(label)]:
            accelerators.append([label, 'TuneUp'])
        else:
            accelerators.append([label, 'JumpStart'])
    
    return jsonify({"accelerators": accelerators})

x, y, z = label_to_idx_maps()
print(x)
print()
print(y)
print()
print(z)