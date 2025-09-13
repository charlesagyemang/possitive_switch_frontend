import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.newfiremedia.org/api/v1'}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
