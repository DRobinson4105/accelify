import pandas as pd
import json

accelerators = pd.read_csv('data/accelerators.csv')
companies = pd.read_csv('data/companies.csv')
products_df = pd.read_csv('data/products.csv')  # Renamed to avoid confusion
entitlements = pd.read_csv('data/entitlements.csv')

print(products_df.columns)
    
train_data = {}

for _, company_row in companies.iterrows():
    company_name = company_row['Name']
    industry = company_row['Industry']
    
    company_entitlements = entitlements[entitlements['Company'] == company_name]
    
    products = [] 
    
    for _, entitlement_row in company_entitlements.iterrows():
        product_name = entitlement_row['Product']
        
        product_info = products_df[products_df['Name'] == product_name]
        
        if not product_info.empty:
            product_info = product_info.iloc[0]
            products.append({
                'ProductName': product_info['Name'],
                'ProductCategory': product_info['Category'],
                'IsImplemented': entitlement_row['Implemented']
            })
        else:
            print(f"Warning: Product '{product_name}' not found in the products list.")
    
    other_companies = companies[companies['Industry'] == industry]
    current_products = set(company_entitlements['Product'].unique())
    
    industry_products = set()
    for other_company in other_companies['Name'].unique():
        if other_company != company_name:
            other_entitlements = entitlements[entitlements['Company'] == other_company]
            industry_products.update(other_entitlements['Product'].unique())
    
    recommended_products = industry_products - current_products
    
    train_data[company_name] = {
        'Input': {
            'Industry': industry,   
            'ProductsUsed': products
        },
        'Output': {
            'Recommendations': list(recommended_products)
        }
    }

data = json.dumps(train_data, indent=4)

with open('dataset.json', 'w') as f:
    f.write(data)

print(data)