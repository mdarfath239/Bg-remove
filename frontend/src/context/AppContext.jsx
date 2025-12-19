import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [credit, setCredit] = useState(false)

    const [image, setImage] = useState(false)
    const [resultImage, setResultImage] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const { getToken } = useAuth()
    const { isSignedIn } = useUser()
    const { openSignIn } = useClerk()

    const loadCreditsData = async () => {
        try {

            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } })
            if (data.success) {
                setCredit(data.credits)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const removeBg = async (image) => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('image', image)

            const token = await getToken()

            const { data } = await axios.post(backendUrl + '/api/user/remove-bg', formData, { headers: { token } })

            if (data.success) {
                setResultImage(data.resultImage)
                data.creditBalance && setCredit(data.creditBalance)
            } else {
                toast.error(data.message)
                data.creditBalance && setCredit(data.creditBalance)
                if (data.creditBalance === 0) {
                    navigate('/buy')
                }
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }

    }

    const value = {
        credit, setCredit,
        loadCreditsData,
        backendUrl,
        image, setImage,
        removeBg,
        resultImage, setResultImage,
        loading, setLoading,
        isSignedIn,
        openSignIn
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
