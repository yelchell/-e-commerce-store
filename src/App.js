
import { ProductProvider } from './hook/customhook';
import ProductList from './components/productlist';
import ProductManagement from './pages/productmanagement';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
   <div>
    <ProductManagement/>
   </div>
  );
}

export default App;
