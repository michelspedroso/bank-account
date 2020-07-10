import request from '../utils/api';

export async function getExtracts(payload, type = 'GET') {
  return request(`/record/extract`, type, payload);
}


export default { getExtracts };