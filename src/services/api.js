const RAPIDAPI_KEY = 'b628d35452msh77090e225e8245ap12eeb5jsne5a71a4a3fab';
const RAPIDAPI_HOST = 'apiton.p.rapidapi.com';
const BASE_URL = 'https://apiton.p.rapidapi.com';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwid2FsbGV0IjoiMDo5MDU3NzRjYTMyMTM0OWI5MzRkZjRmODU1NDliOGI1OWVmZGJlNzJiNTZhYjIzMjMzMzM2NTgyYTk4ZDRhNTkwIiwidmVyc2lvbiI6OSwiZXhwIjoxNzg2MDQ1MjUwLCJpYXQiOjE3MzQyMDUyNTB9.s5nuNAsjCmo6fMgJWq31gYX9CvBlQrnS6q8q52NPk2c';

const headers = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
  'Content-Type': 'application/json',
};

const authHeaders = { ...headers, Authorization: AUTH_TOKEN };

async function post(endpoint, body, withAuth = false) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: withAuth ? authHeaders : headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}


export const getWallets = (address) => post('v1.Address/Wallets', { address });
export const getDetails = (address) => post('v1.Address/Details', { address });
export const getTransactions = (address, limit = '10') => post('v1.Address/Transactions', { address, limit });


export const getNftByUsername = (username) => post('v1.Nft/Username', { username });
export const getNftByDomain = (domain) => post('v1.Nft/Domain', { domain });


export const getCryptoRates = (symbol = ['TON', 'BTC', 'ETH']) => post('v1.Rate/Crypto', { symbol });
export const getExchanges = (exchange_name = []) => post('v1.Rate/Exchanges', { exchange_name });
export const getFiatRates = (symbol = ['EUR', 'USD', 'RUB']) => post('v1.Rate/Fiat', { symbol });

export const sendTon = (address, amount, comment = '') => post('v2.Wallet/Send', { address, amount, comment }, true);
export const sendJetton = (address, jetton_master_address, amount) => post('v2.Wallet/SendJetton', { address, jetton_master_address, amount }, true);
export const sendNft = (address, nft_address) => post('v2.Wallet/SendNft', { address, nft_address }, true);


export const mintNft = (data) => post('v2.NftContract/MintNft', data);
export const mintCollection = (data) => post('v2.NftContract/MintCollection', data);


export const mintJetton = (jetton) => post('v2.JettonContract/Mint', { jetton });
export const burnJetton = (jetton_address, amount) => post('v2.JettonContract/Burn', { jetton_address, amount });
export const closeMint = (jetton_master_address) => post('v2.JettonContract/CloseMint', { jetton_master_address });


export const authNew = (access_token) => post('v2.Auth/New', { access_token });
export const authDo = (access_token, address) => post('v2.Auth/Do', { access_token, address });
export const authDelete = (access_token, address) => post('v2.Auth/Delete', { access_token, address });
export const authList = (access_token) => post('v2.Auth/List', { access_token });