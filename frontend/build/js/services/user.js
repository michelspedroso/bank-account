import request from '../utils/api';

export async function signup(payload, type = 'POST') {
  return request(`/user/signup`, type, payload);
}

export async function signin(payload, type = 'POST') {
  return request(`/user/signin`, type, payload);
}

export async function getDetail() {
  return request('/user/detail');
}

export default { signup, signin, getDetail };