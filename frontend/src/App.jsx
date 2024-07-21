import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import Login from './pages/login/Login.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import Home from './pages/home/Home.jsx';
import NavBar from './navbar/NavBar.jsx';
import PageNotFound from './components/pageNotFound.jsx';
import ProductInfo from './pages/products/ProductInfo.jsx';
import Order from './pages/order/Order.jsx';
import CartePage from './pages/carte/CartePage.jsx';
import ProductsPage from './pages/products/ProductsPage.jsx';

function App() {
  const { authUser } = useAuthContext();
  return (
    <div>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route exact path='/' element={<Home />}></Route>
          <Route path='products' element={<ProductsPage />}></Route>
          <Route
            path='login'
            element={authUser ? <Navigate to='/' /> : <Login />}
          ></Route>
          <Route
            path='signup'
            element={authUser ? <Navigate to='/' /> : <SignUp />}
          ></Route>
          <Route
            path='order'
            element={authUser ? <Order /> : <Navigate to='/' />}
          ></Route>
          <Route
            path='carte'
            element={authUser ? <CartePage /> : <Navigate to='/' />}
          ></Route>
          <Route path='Products/product/:id' element={<ProductInfo />}></Route>
          <Route path='*' element={<PageNotFound />}></Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
