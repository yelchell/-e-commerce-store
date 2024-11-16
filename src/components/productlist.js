import react, { useEffect } from 'react'
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import useProductList from '../hook/customhook';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table, Button } from "react-bootstrap";



const ProductList = () => {
    const { products, fetchProducts, addProduct, removeProduct, reorderProducts } = useProductList();
     
     useEffect=(()=>{
        console.log("djghj")
       fetchProducts();
     },[])
    return (
        <div className='container mt-4'>
            <h2>Add Product</h2>
            {console.log(products,"products")}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Discount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    
                </tbody>
            </Table>

        </div>
    )
}



export default ProductList;




