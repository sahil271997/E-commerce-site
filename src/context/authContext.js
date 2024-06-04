import { createContext, useContext, useEffect, useState } from "react";

import db, { auth } from "../firebaseInit";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const authContext = createContext();

function useAuthContext() {
    const value = useContext(authContext);
    return value;
}

function AuthContext({ children }) {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    // useEffect to get logged in user
    useEffect(() => {
        setLoading(true);
        // firebase function to monitor the status of any login/signin attempt
        const unsubscriber = onAuthStateChanged(auth, async (CurrentUser) => {
            if (CurrentUser) {
                let docSnap = await getDoc(doc(db, "users", CurrentUser.email));
                let user = docSnap.data();
                setUserDetails(user);
            }

        })
        setLoading(false);
        return unsubscriber;

    }, [])

    function signUp(data) {
        setLoading(true);
        // firebase function to create new user with email and password
        createUserWithEmailAndPassword(auth, data.email, data.pswrd)
            .then(async (res) => { //this function is adding the name to the profile of current user
                console.log("Signed Up Successfully");
                await updateProfile(res.user, { //res.user represents user
                    displayName: data.name       //addiing name to the user
                });
                const currentUser = {
                    name: data.name,
                    email: data.email,
                    pswrd: data.pswrd,
                    cart: {
                        count: 0,
                        cost: 0,
                        items: []
                    },
                    orders: [],
                }
                await setDoc(doc(db, "users", currentUser.email), currentUser);
                setUserDetails(currentUser);
                toast.success("Signed Up SucessFully! ");
                setLoading(false);
            }).catch((error) => {
                toast.error(error.message);
                setLoading(false);
            })
    }

    function logIn(data) {
        setLoading(true)
        console.log("login function!!!")
        // firebase function to login with user and password
        signInWithEmailAndPassword(auth, data.email, data.pswrd)
            .then(async (res) => {
                console.log("Signed in successfully");
                const currentUser = {
                    name: res.user.displayName,
                    email: res.user.email,
                    pswrd: data.pswrd,
                    cart: {
                        count: 0,
                        cost: 0,
                        items: [],
                    },
                    orders: [],
                }
                setUserDetails(currentUser);
                toast.success("signed In SuccessFully")
                setLoading(false)
            }).catch((error) => {
                toast.error(error.message);
                setLoading(false);
            })
    }

    function logOut() {
        signOut(auth)
            .then(() => {
                console.log("")
                toast.success("Logged Out Successfully!")
                setUserDetails(null);
                setRefresh(!refresh);
            }).catch((err) => {
                toast.error(err.message);
            })
    }

    return (<>
        <authContext.Provider value={{ user: userDetails, signUp, logIn, logOut, loading }}>
            {children}
        </authContext.Provider>
    </>)
}

export default AuthContext;
export { useAuthContext };