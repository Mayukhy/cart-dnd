import axios from "axios";

const API_URL = 'https://dummyjson.com';
export const getproducts = async (filter) => {
    try {
        const {limit,skip} = filter;
        const filteredUrl = `${API_URL}/products?limit=${limit}${skip ? `&skip=${skip}` : ''}`; 
        const response = await axios.get(filteredUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

export const getCategories = async () => {
    try {
        const endPoint = `${API_URL}/products/category-list`; 
        const response = await axios.get(endPoint);
        return response.data;
    } catch (error) {
        console.error("Error fetching products caregories:", error);
    }
}