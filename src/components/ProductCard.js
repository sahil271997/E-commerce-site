import { useAuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../context/productContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ProductCard({ product }) {
    const { user } = useAuthContext();
    const { cart, addToCart, removeFromCart } = useProductContext();
    const [isInCart, setIsInCart] = useState(false);
    const navigate = useNavigate();

    //function to identify which elment is in cart
    useEffect(() => {
        const index = cart.items.findIndex((item) => item.id === product.id);
        if (index != -1) {
            setIsInCart(true);
        } else {
            setIsInCart(false);
        }
    }, [user, cart]);

    //add selected item in the cart
    async function handleAddCart(product) {
        if (!user) {
            console.log("inside if statement!!!")
            toast.info("Please Login First !!!")
            navigate("/");
        } else {
            await addToCart(product);
        }
    }
    const Info=()=>{
        toast.info("Please LogIn First !!!")
    }

    // remove item from cart
    async function handleRemoveCart() {
        await removeFromCart(product);
    }

    return (
    <div className="card border border-primary border-1" style={{ width: "15rem" }}>
        <img src={product.image} className="card-img-top border-bottom border-1 border-primary-subtel" alt="..." height={250} />
        <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-title fs-5">Rs. {product.price}</p>
        </div>
        {user ? isInCart ?
            <button type="button" className="btn btn-danger w-75 align-self-center mb-3 btn-lg fs-5" onClick={() => handleRemoveCart(product)}>Remove</button>
            :
            <button type="button" className="btn btn-primary w-75 align-self-center mb-3 btn-lg fs-5" onClick={() => handleAddCart(product)} >Add to Cart</button>
            :
            <button type="button" className="btn btn-primary w-75 align-self-center mb-3 btn-lg fs-5  pointer-event " onClick={Info}>Add to Cart</button>
        }
    </div>
    )

}
export default ProductCard;
