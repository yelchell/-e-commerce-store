import { useState } from "react";
import axios from 'axios'

const useProductList = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        console.log("Fetching products...");
        try {
            const response = await axios.get('/task/products/search', {
                headers: {
                  'x-api-key': '72njgfa948d9aS7gs5',  // Add your actual token here
                  'Content-Type': 'application/json'
                }
            });
    
            console.log("Response data:", response.data);
            setProducts(response.data.products); // Adjust based on actual data structure
    
        } catch (error) {
            console.error("Error fetching data:", error.message || error);
        }
    };
    

    const addProduct = () => {
        setProducts([...products, { id: Date.now(), title: "", variants: [] }]);
    };

    const removeProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const reorderProducts = (newOrder) => {
        setProducts(newOrder);
    };

    return {
        products,
        setProducts,
        fetchProducts,
        addProduct,
        removeProduct,
        reorderProducts,
    };
};

export default useProductList;
