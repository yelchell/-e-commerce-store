// // src/components/ProductPickerDialog.js
// import React, { useState, useEffect } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Table from 'react-bootstrap/Table';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Image from 'react-bootstrap/Image';
// import axios from 'axios';

// const ProductPickerDialog = ({ show, onClose, onProductSelect }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [products, setProducts] = useState([]);
//     const [selectedProducts, setSelectedProducts] = useState([]);
//     const [selectedVariants, setSelectedVariants] = useState([]);
//     console.log()
//     useEffect(() => {
//         if (searchTerm) {
//             fetchProducts(searchTerm);
//         }
//     }, [searchTerm]);

//     useEffect(() => {
//         if (show) {
//             setSearchTerm('');
//             setProducts([]);
//         }
//     }, [show]);

//     const fetchProducts = async (search) => {
//         try {
//             const response = await axios.get(
//                 `/task/products/search`,
//                 {
//                     params: { search, page: 1, limit: 10 },
//                     headers: {
//                         'x-api-key': '72njgfa948d9aS7gs5'  // Replace with your actual API key
//                     }
//                 });
//             if (response) {
//                 setProducts(response.data);

//             } else {
//                 setProducts([])
//             }
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//     };

//     const handleSelectProduct = (product) => {
//         const isSelected = selectedProducts.includes(product);
//         if (isSelected) {
//             setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
//         } else {
//             setSelectedProducts([...selectedProducts, product]);
//         }
//     };

//     const handleAddProducts = () => {
//         onProductSelect(selectedProducts);
//         onClose();
//     };

//     const handleSelectVariant = (variant) => {
//         const isSelected = selectedVariants.some(v => v.id === variant.id);
//         if (isSelected) {
//             setSelectedVariants(selectedVariants.filter(v => v.id !== variant.id));
//         } else {
//             setSelectedVariants([...selectedVariants, variant]);
//         }
//     };

//     return (
//         <Modal show={show} onHide={onClose} size="lg" centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Select Products</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form.Control
//                     type="text"
//                     placeholder="Search product"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="mb-3"
//                 />
//                 <Table bordered>
//                     <thead>
//                         <tr>
//                             <th></th>
//                             <th>Product</th>
//                             <th>Variants</th>
//                             <th>Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products ? products.map((product) => (
//                             <React.Fragment key={product.id}>
//                                 <tr>
//                                     <td>
//                                         <Form.Check
//                                             type="checkbox"
//                                             checked={selectedProducts.includes(product)}
//                                             onChange={() => handleSelectProduct(product)}
//                                         />
//                                     </td>
//                                     <td>
//                                         <Image src={product.image.src} thumbnail width={50} />{' '}
//                                         {product.title}
//                                     </td>
//                                     <td colSpan="2">
//                                         {product.variants.map((variant) => (
//                                             <div key={variant.id}>
//                                                 <tr key={variant.id}>
//                                                     <td></td>
//                                                     <td></td>
//                                                     <td>
//                                                         <Form.Check
//                                                             type="checkbox"
//                                                             checked={selectedVariants.some(v => v.id === variant.id)}
//                                                             onChange={() => handleSelectVariant(variant)}
//                                                         />
//                                                         {variant.title}
//                                                     </td>
//                                                     <td>${variant.price}</td>
//                                                 </tr>
//                                             </div>
//                                         ))}
//                                     </td>
//                                 </tr>
//                             </React.Fragment>
//                         )) : <>No products found..</>}
//                     </tbody>
//                 </Table>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>
//                     Cancel
//                 </Button>
//                 <Button variant="primary" onClick={handleAddProducts}>
//                     Add
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default ProductPickerDialog;



// src/components/ProductPickerDialog.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import axios from 'axios';

const ProductPickerDialog = ({ show, onClose, onProductSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState([]);

    useEffect(() => {
        if (searchTerm) {
            fetchProducts(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (show) {
            setSearchTerm('');
            setProducts([]);
            setSelectedProducts([]); // Clear previously selected products
            setSelectedVariants([]); // Clear previously selected variants
        }
    }, [show]);

    const fetchProducts = async (search) => {
        try {
            const response = await axios.get(
                `/task/products/search`,
                {
                    params: { search, page: 1, limit: 10 },
                    headers: {
                        'x-api-key': '72njgfa948d9aS7gs5'  // Replace with your actual API key
                    }
                });
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSelectProduct = (product) => {
        const isSelected = selectedProducts.includes(product);

        if (isSelected) {
            // Deselect product and its variants
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
            setSelectedVariants(selectedVariants.filter(v => v.product_id !== product.id));
        } else {
            // Select product and all its variants
            setSelectedProducts([...selectedProducts, product]);
            setSelectedVariants([
                ...selectedVariants,
                ...product.variants.map(variant => ({ ...variant, product_id: product.id }))
            ]);
        }
    };

    const handleSelectVariant = (variant, product) => {
        const isSelected = selectedVariants.some(v => v.id === variant.id);

        if (isSelected) {
            // Deselect the variant
            setSelectedVariants(selectedVariants.filter(v => v.id !== variant.id));

            // If no more variants of this product are selected, deselect the product as well
            const remainingVariants = selectedVariants.filter(v => v.product_id === product.id && v.id !== variant.id);
            if (remainingVariants.length === 0) {
                setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
            }
        } else {
            // Select the variant
            setSelectedVariants([...selectedVariants, variant]);

            // If the product is not selected, select it as well
            if (!selectedProducts.includes(product)) {
                setSelectedProducts([...selectedProducts, product]);
            }
        }
    };

    const handleAddProducts = () => {
        onProductSelect(selectedProducts, selectedVariants);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Products</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    placeholder="Search product"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3"
                />
                <Table bordered>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Product</th>
                            <th>Variants</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map((product) => (
                            <React.Fragment key={product.id}>
                                <tr>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedProducts.includes(product)}
                                            onChange={() => handleSelectProduct(product)}
                                        />
                                    </td>
                                    <td>
                                        <Image src={product.image.src} thumbnail width={50} />{' '}
                                        {product.title}
                                    </td>
                                    <td colSpan="2"></td>
                                </tr>
                                {product.variants.map((variant) => (
                                    <tr key={variant.id}>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedVariants.some(v => v.id === variant.id)}
                                                onChange={() => handleSelectVariant(variant, product)}
                                            />
                                            {variant.title}
                                        </td>
                                        <td>${variant.price}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleAddProducts}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductPickerDialog;
