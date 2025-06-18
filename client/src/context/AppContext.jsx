import { useState } from "react";
import { createContext } from "react";
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [credits, setCredits] = useState(false);
    const [image,setImage] = useState(false);
    const [resultImage,setResultImage] = useState(false)
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const { getToken } = useAuth();
    const {isSignedIn} = useUser();
    const {openSignIn} = useClerk();
    const navigate  = useNavigate()

    const loadCreditData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendURL + '/api/user/credits', { headers: { token } });
            if (data.success) {
                setCredits(data.credits);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const removeBg = async (image) =>{
        try {
            console.log(image);
            if(!isSignedIn){
                return openSignIn()
            }
            setImage(image);
            setResultImage(false);

            navigate('/result')
            const token = await getToken()

            const formData = new FormData()
            image && formData.append('image',image)

            const {data} = await axios.post(backendURL+'/api/image/removeBg',formData,{headers:{token}})

            if(data.success){
                setResultImage(data.resultImage)
                data.creditBalance && setCredits(data.creditBalance)
            }
            else{
                toast.error(data.message);
                data.creditBalance && setCredits(data.creditBalance)
                if(data.creditBalance === 0){
                    navigate("/buy")
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const value = {
        credits, setCredits, loadCreditData, backendURL,image,setImage,removeBg, resultImage,setResultImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;