import { useAuthContext } from "../context/authContext";
import { useEffect,useState } from "react";
import { Grid } from "react-loader-spinner";
import { useProductContext } from "../context/productContext";
import { Link } from "react-router-dom";

function Orders(){
    const {user}=useAuthContext();
    const [loading,setLoading]=useState(true);
    const {orders,fetchOrders}=useProductContext();

     // load pase for fer moment for cart items to be fetched
     useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 350);
    }, [])

    // fetch updated cart
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [orders, user])

    return(<>
        {loading ? <Grid 
            height="80"
                width="80"
                color="#0d6efd"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperClass="loader-style"
                visible={true}
        /> : 
            orders.length ===0 ? 
                <div className="mt-5 container d-flex flex-column align-items-center justify-content-center gap-3">
                <i className="fa-regular fa-face-frown-open fs-1"></i>
                <h6 className="display-6">Your Cart is Empty !</h6>
                {user ? <Link to="/" className="btn btn-primary">Continue Shopping</Link> : <Link to="/signin" className="btn btn-primary">Sign In</Link>}
                </div> : 
                <div className="container">
                    <h4 className="mt-3 text-center w-100 display-4">Your Orders</h4>
                    {orders.map((order,index)=>(
                        <div key={index} className="table-responsive border-top border-primary border-2 p-2 my-3">
                            <table className="table tbale-primary table-bordered border-light table-hover caption-top">
                                <caption className="fs-5">Order Summary | Date :{order.orderDate}</caption>
                                <thead>
                                    <tr className="tabele-active">
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Cost</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="tbale-group-divider">
                                    {order.details.map((product,index)=>(
                                        <tr key={index} className="">
                                            <th scope="row">{index+1}</th>
                                            <td className="">{product.name}</td>
                                            <td className="">{(product.price).toFixed(0)}</td>
                                            <td className="">{product.count}</td>
                                            <td className="">{product.count*product.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Billing Ammount</th>
                                        <td colSpan='3'></td>
                                        <td colSpan=''>₹{(order.total).toFixed(0)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ))}
                </div>}
    </>)
}

export default Orders;