import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/login/Login.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import Home from './pages/home/Home.jsx';
import NavBar from './navbar/NavBar.jsx';
import PageNotFound from './components/pageNotFound.jsx';
import ProductInfo from './pages/products/ProductInfo.jsx';

//import { useAuthContext } from './context/AuthContext';

function App() {
  //const { authUser } = useAuthContext();
  return (
    // <div className='h-full flex justify-center'>
    <div>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route exact path='/' element={<Home />}></Route>
          <Route path='login' element={<Login />}></Route>
          <Route path='signup' element={<SignUp />}></Route>
          <Route path='Products/product/:id' element={<ProductInfo />}></Route>
          <Route path='*' element={<PageNotFound />}></Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
