import request from '../utils/api';

export async function getAccountTypes(payload, type = 'GET') {
  return request(`/account/types`, type, payload);
}

export async function getAccounts(type = 'GET', params = {}) {
  return request('/account', type, params);
}

export async function createAccount(params = {}, type = 'POST') {
  return request('/account', type, params);
}

export async function applyDeposit(payload = {}, type = 'POST') {
  return request('/account/deposit', type, payload);
}

export async function applyTransfer(payload = {}, type = 'POST') {
  return request('/account/transfer', type, payload);
}

export default { getAccountTypes, createAccount, getAccounts, applyDeposit, applyTransfer };