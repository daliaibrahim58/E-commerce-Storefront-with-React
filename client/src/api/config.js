const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
    PRODUCTS: `${BASE_URL}/products`,
    USERS: `${BASE_URL}/users`,
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    REGISTER_ADMIN: `${BASE_URL}/auth/register-admin`,
    ORDERS: `${BASE_URL}/orders`,
};

export default API_URLS;
