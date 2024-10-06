import torch
import torch.nn as nn
from torch.nn.utils.rnn import pack_sequence, pad_sequence
import torch.nn.functional as F
from torch.utils.data import Dataset

class LSTMComponent(nn.Module):
    def __init__(self, hidden_dim, output_dim):
        super(LSTMComponent, self).__init__()
        self.lstm = nn.LSTM(input_size=hidden_dim, hidden_size=hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, input):
        packed_input = pack_sequence(input, enforce_sorted=False)
        packed_output, (hidden, cell) = self.lstm(packed_input)
        return self.fc(hidden.squeeze(0))

class RecommenderModel(nn.Module):
    def __init__(self, industry_size, product_name_size, product_category_size, hidden_dim, padding_value=-1):
        super(RecommenderModel, self).__init__()

        self.product_name_size = product_name_size
        self.padding_value = padding_value

        self.industry_embedding = nn.Embedding(num_embeddings=industry_size+1, embedding_dim=hidden_dim, padding_idx=industry_size)
        self.product_name_embedding = nn.Embedding(num_embeddings=product_name_size+1, embedding_dim=hidden_dim, padding_idx=product_name_size)
        self.product_category_embedding = nn.Embedding(num_embeddings=product_category_size+1, embedding_dim=hidden_dim, padding_idx=product_category_size)
        self.product_is_implemented_embedding = nn.Embedding(num_embeddings=3, embedding_dim=hidden_dim, padding_idx=2)

        self.lstm = LSTMComponent(hidden_dim=hidden_dim * 3, output_dim=hidden_dim)

        self.fc1 = nn.Linear(hidden_dim * 2, 128)
        self.fc2 = nn.Linear(128, product_name_size)

        self.dropout = nn.Dropout(p=0.2)

    def expand_product_name_size(self, new_size):
        new_embedding = nn.Embedding(new_size, self.product_name_embedding.embedding_dim, padding_idx=self.padding_value)
        new_fc = nn.Linear(32, new_size)
        
        new_embedding.weight.data[:self.product_name_embedding.num_embeddings] = self.product_name_embedding.weight.data
        nn.init.normal_(new_embedding.weight.data[self.product_name_embedding.num_embeddings:])

        with torch.no_grad():
            new_fc.weight[:self.fc2.out_features] = self.fc2.weight
            new_fc.bias[:self.fc2.out_features] = self.fc2.bias
            nn.init.normal_(new_fc.weight[self.fc2.out_features:])
            nn.init.normal_(new_fc.bias[self.fc2.out_features:])
        
        self.product_name_embedding = new_embedding
        self.fc2 = new_fc

        self.product_name_size = new_size

    def forward(self, industry, product_name, product_category, product_is_implemented, new_size):
        if new_size > self.product_name_size:
            self.expand_product_name_size(new_size)

        industry_embedded = self.industry_embedding(industry)
        product_name_embedded = self.product_name_embedding(product_name)
        product_category_embedded = self.product_category_embedding(product_category)
        product_is_implemented_embedded = self.product_is_implemented_embedding(product_is_implemented)

        product_embedded = torch.cat([product_name_embedded, product_category_embedded, product_is_implemented_embedded], dim=-1)

        product = self.lstm(product_embedded)

        combined = torch.cat([industry_embedded.squeeze(), product], dim=1)

        x = F.relu(self.fc1(combined))
        x = self.dropout(x)
        output = self.fc2(x)

        output = output[:, :self.product_name_size]

        return output
    
class RecommenderDataset(Dataset):
    def __init__(self, data, industry_map, product_name_map, product_category_map, device="cpu"):
        industry_len, product_name_len, product_category_len = len(industry_map), len(product_name_map), len(product_category_map)
        self.industries = torch.tensor([[industry_map[x["Input"]["Industry"]]] for x in data]).to(device)

        self.product_names = [torch.tensor([product_name_map[y["ProductName"]] for y in x["Input"]["Products"]]) for x in data]
        self.product_names = pad_sequence(self.product_names, batch_first=True, padding_value=product_name_len).to(device)

        self.product_categories = [torch.tensor([product_category_map[y["ProductCategory"]] for y in x["Input"]["Products"]]) for x in data]
        self.product_categories = pad_sequence(self.product_categories, batch_first=True, padding_value=product_category_len).to(device)

        self.product_is_implemented = [torch.tensor([y["IsImplemented"] for y in x["Input"]["Products"]]).long() for x in data]
        self.product_is_implemented = pad_sequence(self.product_is_implemented, batch_first=True, padding_value=2).to(device)

        self.output = [torch.tensor([product_name_map[y] for y in x["Output"]]).long() for x in data]
        self.output = pad_sequence(self.output, batch_first=True, padding_value=product_name_len).to(device)

    def __len__(self):
        return self.product_names.shape[0]
    
    def __getitem__(self, index):
        return self.industries[index], self.product_names[index], self.product_categories[index], self.product_is_implemented[index], self.output[index]