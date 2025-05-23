import { useEffect } from 'react';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import Products from './pages/ProductsAdd';
import ProductsGet from './pages/ProductsGet';
import Categories from './pages/Categories';
import { Routes, Route, useNavigate} from 'react-router-dom';
import { useDispatch } from "react-redux";
import SecuredRoute from './components/Common/SecuredRoutes';
import { setUser } from './redux/slices/userSlice';
import { ToastContainer } from 'react-toastify';
import AddDiscount from './pages/AddDiscount';
import GetDiscounts from './pages/GetDiscounts';
import GetUser from './pages/GetUser';
import UserHistory from './components/user/UserHistory';
import ManageProfile from './pages/ManageProfile';
import DownloadOrderSlip from './pages/DownloadOrderSlip';
import ManageOrder from './pages/ManageOrder';



function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let loadedOnce = false

  useEffect(() => {
    if(loadedOnce) return;
    loadedOnce = true;

    const userString = localStorage.getItem("userData");
    
    if (!userString) {
      navigate("/")
      return;
    }
    try {
      const userData = JSON.parse(userString);
      dispatch(setUser(userData));
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }

  }, []);

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<SecuredRoute><Home /></SecuredRoute>} />

        <Route path='/login' element={<LoginPage />} />
        <Route path="/categories" element={<SecuredRoute><Categories /></SecuredRoute>} />
        <Route path="/products/add" element={<SecuredRoute><Products /></SecuredRoute>} />
        <Route path="/products/get" element={<SecuredRoute><ProductsGet /></SecuredRoute>} />
        <Route path="/discounts/add" element={<SecuredRoute><AddDiscount /></SecuredRoute>} />
        <Route path="/discounts/get" element={<SecuredRoute><GetDiscounts/></SecuredRoute>} />
        <Route path="/users/get-users" element={<SecuredRoute><GetUser/></SecuredRoute>} />
        <Route path="/users/get-user-history/:userId" element={<SecuredRoute><UserHistory /></SecuredRoute>} />
        <Route path="/manage-store" element={<SecuredRoute><ManageProfile/></SecuredRoute>} />
        <Route path="/order/download-slip" element={<SecuredRoute><DownloadOrderSlip/></SecuredRoute>} />
        <Route path="/order/manage-order" element={<SecuredRoute><ManageOrder/></SecuredRoute>} />

      </Routes>
    </div>
  );
}

export default App;
