import torch
import torch.nn as nn
import torch.optim as optim
from tqdm import tqdm
from torch.utils.data import DataLoader
import json
from utils import *

torch.manual_seed(1234)
torch.cuda.manual_seed(1234)

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

with open("dataset.json", "r") as file:
    data = json.load(file)["Data"]

MODEL_NAME = "model.pth"
TRAIN_TEST_SPLIT = int(0.8 * len(data))
BATCH_SIZE = 8
LEARNING_RATE = 1e-4

with open("labels.json", "r") as file:
    info = json.load(file)

product_name_map = {k: v for v, k in list(enumerate(info["Product_Names"]))}
product_category_map = {k: v for v, k in list(enumerate(info["Product_Categories"]))}
industry_map = {k: v for v, k in list(enumerate(info["Industries"]))}

def train(product_name_map, product_category_map, industry_map):
    #TODO build dataset from mongodb data
    product_name_len, product_category_len, industry_len = len(product_name_map), len(product_category_map), len(industry_map)
    train_dataset = RecommenderDataset(data[:TRAIN_TEST_SPLIT], industry_map, product_name_map, product_category_map, device)
    test_dataset = RecommenderDataset(data[TRAIN_TEST_SPLIT:], industry_map, product_name_map, product_category_map, device)

    train_dataloader = DataLoader(train_dataset, BATCH_SIZE, shuffle=True)
    test_dataloader = DataLoader(test_dataset, BATCH_SIZE, shuffle=False)

    model = RecommenderModel(
        industry_len,
        product_name_len,
        product_category_len,
        hidden_dim=256
    ).to(device)

    model.load_state_dict(torch.load('model.pth', weights_only=True))

    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    criterion = nn.BCEWithLogitsLoss()

    epochs = 25

    for epoch in tqdm(range(epochs)):
        avg_train_loss, avg_test_loss = 0, 0

        model.train()

        for X1, X2, X3, X4, y in train_dataloader:
            optimizer.zero_grad()

            output = model(X1, X2, X3, X4, product_name_len)

            loss = criterion(output, y)

            avg_train_loss += loss.item()

            loss.backward()
            optimizer.step()

        model.eval()

        with torch.inference_mode():
            for X1, X2, X3, X4, y in test_dataloader:
                output = model(X1, X2, X3, X4, product_name_len)

                loss = criterion(output, y)

                avg_test_loss += loss.item()
        
        avg_train_loss /= len(train_dataloader)
        avg_test_loss /= len(test_dataloader)

        print(f"Epoch: {epoch} | Train Loss: {avg_train_loss} | Test Loss: {avg_test_loss}")

    torch.save(obj=model.state_dict(), f=MODEL_NAME)

train(product_name_map, product_category_map, industry_map)