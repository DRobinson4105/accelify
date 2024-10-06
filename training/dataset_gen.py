import pandas as pd
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict, Counter
from sklearn.preprocessing import MinMaxScaler

accelerators = pd.read_csv('data/accelerators.csv')
companies = pd.read_csv('data/companies.csv')
products = pd.read_csv('data/products.csv')
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

def get_similar_products(cooccurrence_matrix, product_name, top_n=5):
    if product_name in cooccurrence_matrix.index:
        similar_products = cooccurrence_matrix[product_name].sort_values(ascending=False).head(top_n).index.tolist()
        return similar_products
    return []

def get_popular_products(entitlements, threshold=0.5):
    product_count = entitlements.groupby('Product')['Company'].nunique()
    total_companies = companies['Name'].nunique()
    popular_products = product_count[product_count / total_companies >= threshold].index.tolist()
    return popular_products

def create_cooccurrence_matrix(entitlements, weight=0.5):
    cooccurrence = pd.DataFrame(0, index=entitlements['Product'].unique(), columns=entitlements['Product'].unique())
    for company, group in entitlements.groupby('Company'):
        products = group['Product'].tolist()
        for i in range(len(products)):
            for j in range(i + 1, len(products)):
                tot_weight = weight / (abs(i - j) + 1)
                cooccurrence.loc[products[i], products[j]] += tot_weight
                cooccurrence.loc[products[j], products[i]] += tot_weight
    np.fill_diagonal(cooccurrence.values, 0)
    return cooccurrence

def score_recommended_products(company, industry, used_products, recommended_products, cooccurrence_matrix, industry_groups, popular_products):
    scores = {}
    used_product_names = [p['ProductName'] for p in used_products] 
    for product in recommended_products:
        score = 0
        
        for used_product in used_products:
            if used_product['ProductName'] in cooccurrence_matrix.index and product in cooccurrence_matrix.columns:
                score += cooccurrence_matrix.loc[used_product['ProductName'], product] * 2.5
        
        industry_products = entitlements[entitlements['Company'].isin(
            companies[companies['Industry'] == industry]['Name']
        )]['Product'].unique()
        if product in industry_products:
            score += 2
        
        similar_industries = industry_groups.get(industry, [])
        for similar_industry in similar_industries:
            similar_industry_products = entitlements[entitlements['Company'].isin(
                companies[companies['Industry'] == similar_industry]['Name']
            )]['Product'].unique()
            if product in similar_industry_products:
                score += 1
        
        if product in popular_products:
            score += 0.5
        
        if product in used_product_names:
            score *= 0.6
        
        scores[product] = score
    

    if scores:
        scaler = MinMaxScaler()
        normalized_scores = scaler.fit_transform(np.array(list(scores.values())).reshape(-1, 1)).flatten()
        filtered_scores = {product: normalized_score for product, normalized_score in zip(scores.keys(), normalized_scores) if normalized_score >= 0.8}
        
        sorted_scores = dict(sorted(filtered_scores.items(), key=lambda x: x[1], reverse=True))
        return sorted_scores
    
    return {}
    


def process_data(companies, entitlements, products, industry_groups, popular_products, cooccurrence_matrix):
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
        
        for used_product in used_products:
            similar_products = get_similar_products(cooccurrence_matrix, used_product['ProductName'])
            recommended_products.update(similar_products)

        # recommended_products = recommended_products - set(company_entitlements['Product'])
        
        scored_products = score_recommended_products(company_name, industry, used_products, recommended_products, cooccurrence_matrix, industry_groups, popular_products)
        top_recommendations = scored_products
                
        train_data["Data"].append({
            "Input": {
                "Industry": industry,
                "Products": used_products
            },
            "Output": top_recommendations
        })
        
    additional_data = {
        "Product_Names": list(product_names),
        "Product_Categories": list(product_categories),
        "Industries": list(industries)
    }
        
    return train_data, additional_data

industry_groups = industry_grouping(companies)
popular_products = get_popular_products(entitlements)
cooccurrence_matrix = create_cooccurrence_matrix(entitlements)

train_data, additional_data = process_data(companies, entitlements, products, industry_groups, popular_products, cooccurrence_matrix)

data = json.dumps(train_data, indent=4)
add_data = json.dumps(additional_data, indent=4)
with open('labels.json', 'w') as f:
    f.write(add_data)
with open('dataset.json', 'w') as f:
    f.write(data)