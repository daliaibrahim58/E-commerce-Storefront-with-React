const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
    PRODUCTS: `${BASE_URL}/items`,
    USERS: `${BASE_URL}/users`,
    ORDERS: `${BASE_URL}/orders`,
};

export default API_URLS;
