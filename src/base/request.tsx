import axios from 'axios';
import * as env from '@/env';

export const apiClient = axios.create({
  baseURL: '',
});
