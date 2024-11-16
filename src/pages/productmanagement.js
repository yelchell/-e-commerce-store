
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductPickerDialog from '../components/productpicker';

const ItemType = {
    VARIANT: 'variant',
};

// Draggable Variant Component
const DraggableVariant = ({ variant, index, moveVariant, productIndex }) => {
    const [, ref] = useDrag({
        type: ItemType.VARIANT,
        item: { index, productIndex },
    });

    const [, drop] = useDrop({
        accept: ItemType.VARIANT,
        hover: (draggedItem) => {
            if (draggedItem.index !== index || draggedItem.productIndex !== productIndex) {
                moveVariant(draggedItem.index, index, productIndex);
                draggedItem.index = index; // Update the dragged item's index
            }
        },
    });

    return (
        <Row ref={(node) => ref(drop(node))} className="align-items-center mb-2">
            <Col>
                <Form.Control className="form-control" value={variant.title} readOnly />
            </Col>
            <Col>
                <Form.Control className="form-control" value={`$${variant.price}`} readOnly />
            </Col>
        </Row>
    );
};

const ProductManagement = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [variantVisibility, setVariantVisibility] = useState({}); // Track visibility of variants
    const [discountEdit, setDiscountEdit] = useState({}); // Track which product is being edited for discount

    // Open dialog for adding or editing a product
    const handleOpenDialog = (index) => {
        setEditingIndex(index); // Set the index of the input being edited
        setShowDialog(true);
    };

    // Close the product picker dialog
    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingIndex(null); // Reset editing index
    };

    // Handle product and variant selection from the dialog
    const handleProductSelect = (products, variants) => {
        const selectedProduct = products[0]; // Assuming only one product is selected at a time
        const productWithVariants = {
            ...selectedProduct,
            variants: variants.filter((variant) => variant.product_id === selectedProduct.id),
        };

        setSelectedProducts((prev) => {
            const updatedProducts = [...prev];
            if (editingIndex !== null) {
                // Update the specific input box that was edited
                updatedProducts[editingIndex] = productWithVariants;
            } else {
                // Add a new product if no specific index is being edited
                updatedProducts.push(productWithVariants);
            }
            return updatedProducts;
        });

        // Reset the dialog states
        setShowDialog(false);
        setEditingIndex(null);
    };

    // Add a new input box for a product
    const handleAddProduct = () => {
        setSelectedProducts((prev) => [...prev, { id: null, title: '', variants: [], discount: null }]);
    };

    // Toggle variant visibility
    const toggleVariants = (index) => {
        setVariantVisibility((prev) => ({
            ...prev,
            [index]: !prev[index], // Toggle visibility for the specific product
        }));
    };

    // Move variants within the product
    const moveVariant = (fromIndex, toIndex, productIndex) => {
        setSelectedProducts((prev) => {
            const updatedProducts = [...prev];
            const variants = [...updatedProducts[productIndex].variants];
            const [movedVariant] = variants.splice(fromIndex, 1); // Remove the dragged variant
            variants.splice(toIndex, 0, movedVariant); // Insert it at the new position
            updatedProducts[productIndex].variants = variants;
            return updatedProducts;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Discount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product, index) => (
                            <React.Fragment key={index}>
                                {/* Product Input */}
                                <tr>
                                    <td>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                className="form-control-lg"
                                                value={product.title || 'Select Product'}
                                                readOnly
                                                placeholder="Select Product"
                                                onClick={() => handleOpenDialog(index)} // Open dialog for editing this product
                                            />
                                            {product.title && (
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => handleOpenDialog(index)}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </InputGroup>
                                        <Button
                                            variant="link"
                                            onClick={() => toggleVariants(index)} // Toggle variant visibility
                                            disabled={!product.title} // Disable if no product is selected
                                        >
                                            {variantVisibility[index] ? 'Hide Variants' : 'Show Variants'}
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            disabled={!product.title} // Disable if no product is selected
                                            onClick={() =>
                                                setDiscountEdit((prev) => ({
                                                    ...prev,
                                                    [index]: true,
                                                }))
                                            }
                                        >
                                            {discountEdit[index] ? (
                                                <>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Discount Value"
                                                        className="mb-2"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setSelectedProducts((prev) => {
                                                                const updatedProducts = [...prev];
                                                                updatedProducts[index].discountValue = value;
                                                                return updatedProducts;
                                                            });
                                                        }}
                                                    />
                                                    <Form.Select
                                                        onChange={(e) => {
                                                            const type = e.target.value;
                                                            setSelectedProducts((prev) => {
                                                                const updatedProducts = [...prev];
                                                                updatedProducts[index].discountType = type;
                                                                return updatedProducts;
                                                            });
                                                        }}
                                                    >
                                                        <option value="percentage">%</option>
                                                        <option value="flat">Flat</option>
                                                    </Form.Select>
                                                </>
                                            ) : (
                                                'Add Discount'
                                            )}
                                        </Button>
                                    </td>
                                </tr>

                                {/* Variants */}
                                {variantVisibility[index] &&
                                    product.variants.map((variant, variantIndex) => (
                                        <tr key={variant.id}>
                                            <td colSpan="2">
                                                <DraggableVariant
                                                    variant={variant}
                                                    index={variantIndex}
                                                    moveVariant={moveVariant}
                                                    productIndex={index}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))}

                        {/* Add Product Button */}
                        <tr>
                            <td colSpan="2">
                                <Button variant="success" onClick={handleAddProduct}>
                                    Add Product
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <ProductPickerDialog
                    show={showDialog}
                    onClose={handleCloseDialog}
                    onProductSelect={handleProductSelect}
                />
            </Container>
        </DndProvider>
    );
};

export default ProductManagement;
