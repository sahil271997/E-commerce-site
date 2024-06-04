import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";
import { data } from "../data";
import db from "../firebaseInit";
import { toast } from "react-toastify";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const productContext = createContext();

function useProductContext() {
    const value = useContext(productContext);
    return value;
}

function ProductContext({ children }) {
    // categories of products
    const categories = ["Men's Clothing", "Women's Clothing", "Electronics", "Jewellery"];
    // 
    const { user } = useAuthContext();
    // different states
    const [products, setProducts] = useState(data);
    const [searchText, setSearchText] = useState("");
    const [filterPrice, setFilterPrice] = useState(50000);
    const [filterCategories, setFilterCategories] = useState([]);
    const [cart, setcart] = useState({ count: 0, cost: 0, items: [] });
    const [orders, setOrders] = useState([]);
    // usiing refresh to update the page after actions on cart items (add/remove/inc/rem)
    const [refresh, setRefresh] = useState(false);

    // get the search text from input
    const handleSearch = (e) => {
        const search = e.target.value;
        setSearchText(search);
    }


    //fuction to get filter values from filterinputs
    function handleFilter( category, price ) {
        setFilterPrice(price);
        if (category !== null) {
            if (filterCategories.includes(category)) {
                const temp = filterCategories.filter((cat) => cat !== category);
                setFilterCategories(temp);
            }
            else {
                setFilterCategories([...filterCategories, category])
            }
        }
    }

    // get the items already in cart
    const fetchCartItems = () => {
        if (user) {
            onSnapshot(doc(db, "users", user.email), (currentUser) => {
                if (currentUser.data) {
                    setcart(currentUser.data().cart);
                }
            })
        }
    }

    //fetch prev orders
    const fetchOrders = () => {
        if (user) {
            onSnapshot(doc(db, "users", user.email), (currentUser) => {
                if (currentUser.data()) {
                    setOrders(currentUser.data().orders);
                }
            })
        }
    }

    // add an item to the cart
    const addToCart = async (data) => {
        console.log("inside add to cart function!!!")
        const isItemPresent = cart.items.some((item) => item.id === data.id);
        const item = { category: data.category, id: data.id, image: data.image, price: data.price, name: data.name, count: 1 };
        if (isItemPresent) {
            toast.info("Item is already Present in cart !")
            return;
        }
        await updateDoc(doc(db, "users", user.email), {
            cart: {
                cost: cart.cost + item.price,
                count: cart.count + 1,
                items: [...cart.items, item],
            }
        });
        toast.success("Item added Sucessfully !");
        setRefresh(!refresh);
    }

    //remove item from cart
    const removeFromCart = async (data) => {
        // fiding the item which is going to be removd from cart
        const removedItem = cart.items.find((item) => item.id === data.id);
        // filter out the item which is going to be removed from the cart array 
        const updatedItems = cart.items.filter((item) => item.id !== data.id);
        console.log(removedItem);

        await updateDoc(doc(db, "users", user.email), {
            cart: {
                cost: cart.cost - (data.price * removedItem.count),
                count: cart.count - removedItem.count,
                items: updatedItems,
            }
        });
        toast.success("Item removed SucessFully !");
        setRefresh(!refresh);
    }

    // increase the count of an item in cart
    const increaseCount = async (data) => {
        const index = cart.items.findIndex((item) => item.id === data.id);
        if (index !== -1) {
            cart.items[index].count++;
            await updateDoc(doc(db, "users", user.email), {
                cart: {
                    cost: cart.cost + data.price,
                    count: cart.count + 1,
                    items: cart.items,
                }
            })
            setRefresh(!refresh);
        }
    }

    //decrease the count from cart
    const decreaseCount = async (data) => {
        const index = cart.items.findIndex((item) => item.id === data.id);

        if (index !== -1) {
            if (cart.items[index].count > 1) {
                cart.items[index].count--;
                await updateDoc(doc(db, "users", user.email), {
                    cart: {
                        cost: cart.cost - data.price,
                        count: cart.count - 1,
                        items: cart.items,
                    }
                });
                setRefresh(!refresh);
            }
            else {
                removeFromCart(data);
            }
        }

    }


    //clear the cart
    const clearCart = async () => {
        await updateDoc(doc(db, "users", user.email), {
            cart: {
                cost: 0,
                count: 0,

                items: [],
            }
        });
        setRefresh(!refresh);
    }

    // purchase all the items from the cart
    const purchaseAll = async () => {
        let date = new Date();
        let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        let order = {
            orderDate: currentDate,
            total: cart.cost,
            details: cart.items,
        }
        await updateDoc(doc(db, "users", user.email), {
            orders: [order, ...orders]
        })
        setRefresh(!refresh);
    }

    //apply filter on products on products onload
    useEffect(() => {
        if (filterCategories.length === 0) {
            const filteredProducts = data.filter((product) => product.price <= filterPrice && product.name.toLowerCase().includes(searchText.toLowerCase()));
            setProducts(filteredProducts);
        } else {
            const filteredProducts = data.filter((product) => product.price <= filterPrice && filterCategories.includes(product.category) && product.name.toLowerCase().includes(searchText.toLowerCase()));
            setProducts(filteredProducts);
        }
    }, [filterPrice, filterCategories, searchText]);

    useEffect(() => {
        if (user) {
            fetchCartItems();
            fetchOrders();
        }
    }, [refresh, cart, user]);


    return (
        <productContext.Provider value={{
            categories, products
            , handleSearch
            , handleFilter
            , filterCategories
            , filterPrice
            , filterPrice
            , products
            , setProducts
            , cart
            , addToCart
            , removeFromCart
            , increaseCount
            , decreaseCount
            , clearCart
            , purchaseAll
            , fetchCartItems
            , fetchOrders
            , orders
        }}>
            {children}
        </productContext.Provider>
    )
}

export default ProductContext;
export { useProductContext };