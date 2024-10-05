import pandas as pd
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict, Counter

accelerators = pd.read_csv('data/accelerators.csv')
companies = pd.read_csv('data/companies.csv')
products = pd.read_csv('data/products.csv')  # Renamed to avoid confusion
entitlements = pd.read_csv('data/entitlements.csv')

def industry_grouping(companies, threshold=0.4):
    industry_names = companies['Industry'].unique()
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(industry_names)
    
    cos_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    industry_groups = defaultdict(list)
    for i, industry in enumerate(industry_names):
        for j, similarity in enumerate(cos_sim[i]):
            if similarity > threshold and i != j:
                industry_groups[industry].append(industry_names[j])
    return industry_groups

def get_popular_products(entitlements, threshold=0.8):
    product_count = entitlements.groupby('Product')['Company'].nunique()
    total_companies = companies['Name'].nunique()
    popular_products = product_count[product_count / total_companies >= threshold].index.tolist()
    return popular_products


def process_data(companies, entitlements, products, industry_groups, popular_products):
    train_data = {"Data": []} 
    product_names = set()
    product_categories = set()
    industries = set()
    
    for _, company_row in companies.iterrows():
        company_name = company_row['Name']
        industry = company_row['Industry']
        
        company_entitlements = entitlements[entitlements['Company'] == company_name]
        used_products = [] 
        
        industries.add(industry)
        
        for _, entitlement_row in company_entitlements.iterrows():
            product_name = entitlement_row['Product']
            product_info = products[products['Name'] == product_name].iloc[0]
            used_products.append({
                'ProductName': product_info['Name'],
                'ProductCategory': product_info['Category'],
                'IsImplemented': entitlement_row['Implemented']
            })
        
            product_names.add(product_info['Name'])
            product_categories.add(product_info['Category'])
            
        recommended_products = set(popular_products)
        
        industry_products = entitlements[entitlements['Company'].isin(
            companies[companies['Industry'] == industry]['Name']
        )]['Product'].unique()
        
        recommended_products.update(industry_products)
        
        similar_industries = industry_groups.get(industry, [])
        for similar_industry in similar_industries:
            similar_industry_products = entitlements[entitlements['Company'].isin(
                companies[companies['Industry'] == similar_industry]['Name']
            )]['Product'].unique()
            recommended_products.update(similar_industry_products)
        
        recommended_products = recommended_products - set(company_entitlements['Product'])
        
        train_data["Data"].append({
            "Input": {
                "Industry": industry,
                "Products": used_products
            },
            "Output": 
                list(recommended_products)

        })
        
    additional_data = {
        "Product_Names": list(product_names),
        "Product_Categories": list(product_categories),
        "Industries": list(industries)
    }
        
    return train_data, additional_data

industry_groups = industry_grouping(companies)

popular_products = get_popular_products(entitlements)

train_data, additional_data = process_data(companies, entitlements, products, industry_groups, popular_products)

data = json.dumps(train_data, indent=4)

add_data = json.dumps(additional_data, indent=4)

print(train_data)

with open('additional_data.json', 'w') as f:
    f.write(add_data)
with open('dataset.json', 'w') as f:
    f.write(data)