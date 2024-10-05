
import pandas as pd 
import os


accelerators = pd.read_csv('data/accelerators.csv')
companies = pd.read_csv('data/companies.csv')
products = pd.read_csv('data/products.csv')
entitlements = pd.read_csv('data/entitlements.csv')


train_data = []

for _, company_row in companies.iterrows():
    company_name = company_row['Name']
    industry = company_row['Industry']
    
    company_entitlements = entitlements[entitlements['Company'] == company_name]
    
    for _, entitlement_row in company_entitlements.iterrows():
        if entitlement_row['Implemented']:
            product_name = entitlement_row['Product']
            product_info = products[products['Name'] == product_name].iloc[0]
            
            train_data.append({
                'company': company_name,
                'industry': industry,
                'product': {
                    'ProductName': product_info['Name'],
                    'Category': product_info['Category'],
                    'IsImplemented': entitlement_row['Implemented']
                }
            })

train_df = pd.DataFrame(train_data)

print(train_df)