import axios from 'axios';
import { API_DOMAIN } from '../env';

const instance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getListedList = (data: any) => {
  return instance.post('item/search', JSON.stringify(data)).then((data) => {
    return data.data.data;
  });
};

export const getPurchaseList = (data: any) => {
  return instance.post('purchase/search', JSON.stringify(data)).then((data) => {
    return data.data.data;
  });
};

export const getItemDetail = (groupId: string) => {
  return instance.get(`item_by_group/${groupId}`).then((data) => {
    return data.data.data.item;
  });
};
