import { Slide, ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Error from './components/Error';
import Cart from './components/Cart';
import Orders from './components/Orders';

function App() {
  const router =createBrowserRouter([
    {path:"/",errorElement:<Error/>,element:<Navbar />,children:[
      {index:true,element:<Home />},
      {path:"/cart",element:<Cart />},
      {path:"/orders",element:<Orders />},
      {path:"/signIn",element:<SignIn />},
      {path:"/signUp",element:<SignUp />}
    ]}
  ])

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
