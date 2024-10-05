import pandas as pd 
from sklearn.preprocessing import LabelEncoder

accelerators = pd.read_excel('accelerators.xlsx')
companies = pd.read_excel('companies.xlsx')
products = pd.read_excel('products.xlsx')
entitlements = pd.read_excel('entitlements.xlsx')