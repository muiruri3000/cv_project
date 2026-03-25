import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import {motion, AnimatePresence} from "framer-motion"

const Dashboard = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    })
    const API_URL = process.env.REACT_APP_API_URL
    useEffect(()=>{
        if (!error) return
        const timer = setTimeout(()=>{
                setError(null)
            }, 5500)

            return () => clearTimeout(timer)
    },[error])

    useEffect(()=>{
         if (!success) return
         const timer = setTimeout(()=>{
                setSuccess(null)

            }, 5500)
            return () => clearTimeout(timer)
    },[success])


    useEffect(()=>{
        if (location.state?.message){
            setSuccess(location.state.message)

   window.history.replaceState({}, document.title,location.pathname)
    }
}, [location.state])

console.log("success: ",success)
    useEffect(() =>{
        const token = localStorage.getItem("access")
        axios.get(`${API_URL}/api/me/`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response)=>{
            setUser(response.data)
            
            
        })
        .catch((error)=>{
            if (error.response){
            if(error.response.status === 401){
                setError("Unauthorized. Please Log in Again.")
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            setUser(null)
            setTimeout(()=>{
                window.location.href = "/login2"
            }, 1500)

            } else{
                setError(error.response?.data?.detail || "An error occurred while fetching user data.")
            }
        } else {
            setError("Network error. Please check your connection.")
        }
        })},
        [] )
        
        const handleChage = (e)=>{
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
        const handleSubmit = (e) =>{
            e.preventDefault()
            setError(null)
            setSuccess(null)
            if(formData.new_password !== formData.confirm_password){
                setError("New password and confirm password do not match")
                return
            }
            const token = localStorage.getItem("access")
            axios.post("http://localhost:8000/api/change-password/", {
                old_password: formData.old_password,
                new_password: formData.new_password,
            },{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response)=>{
            if(response.status === 200){

               navigate("/dashboard", {state:{message:"Password change successful!"}})
            }
            setFormData({
                old_password: "",
                new_password: "",
                confirm_password: "",
            })
        })
        .catch((error)=>{
            if(error.response){
                const status = error.response.status;
                const data = error.response.data; 
                    if (status === 400){
                        const messages = Object.values(data).flat().join(" ")
                        setError(messages || "Invalid Input")
                    } else if (status === 401){
                        setError("Session Expired Please Login!")
                        localStorage.removeItem("access")
                        localStorage.removeItem("refresh")
                        setUser(null)
            setTimeout(()=>{
                navigate("/login2")
            }, 1500)


                    } else if(status === 403){
                        setError("You are not allowed to perform this operation")
                    }else{
                        setError("Server Error. Please try again later");
                    }
            }else if (error.request){
                setError("Server not responding. Check your internet connection.")
            }else{
                setError("An unexpected error occurred")
            }

            console.error("Error changing password:", error)
           

           
        })


    }
    return (
        <>
        <div className="mt-[150px] pt-5 text-center" >
            <div>
                {
                    error &&
                    <div className="text-center border border-red-400 bg-red-100 px-4 py-2 rounded text-red-700 mb-4">
             {error}   

          
            </div>
            }
            <AnimatePresence>

               {
                   success && (
                       <motion.div
                       key="success-msg"
                       initial={{opacity:0, y:1}}
                       animate={{opacity:1, y:0}}
                       exit={{opacity:0,y:-10}}
                       transition={{duration:0.5}}
                       className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                        {success}
                    </motion.div>

)
}
                </AnimatePresence>
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <h3>Welcome, {user?.username}!</h3>
            </div>

            <div className="mt-2">
                <h2 className="text-xl font-semibold mb-3">Change Password</h2>
                <form onSubmit={handleSubmit} className="max-w-sm">
                
                <div className="my-2">
                    <label className="block mb-1">Old Password</label>
                    <input 
                    type="password"
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    onFocus={(e) => e.target.value = ""}
                    required
                    />
                </div>
                <div className="my-2">
                    <label className="block mb-1">New Password</label>
                    <input 
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    onFocus={(e) => e.target.value = ""}
                    required
                    />
                </div>
                <div className="my-2">
                    <label className="block mb-1">Confirm New Password</label>
                    <input 
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    onFocus={(e) => e.target.value = ""}
                    required
                    />
                </div>
                <div className="mt-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Change Password</button>                         
                </div>
                </form>
            </div>
        </div>
                    </>
    )
}
export default Dashboard