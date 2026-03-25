import axios from "axios";

const api = axios.create({
    baseURL:"http://backend:8000/api",
})


api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access");

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if(!error.response){
            return Promise.reject({...error, message:"Network error. Check your connection."})
        }
        const status = error.response.status;

        if (status === 400){
           return Promise.reject({...error, message:"Bad request. Check your input"})
        }
        if (status === 401){
           return Promise.reject({...error, message:"unauthorised. Please log in."})
        }
        if (status === 403){
           return Promise.reject({...error, message:"Forbidden. Access denied"})
        }

             if (status === 404){
           return Promise.reject({...error, message:"Resource not found."})
        }

             if (status === 500){
           return Promise.reject({...error, message:"Server error. Try again later."})
        }
                if (status === 429){
           return Promise.reject({...error, message:"Too many login attempts. wait a minute"})
        }


        return Promise.reject(error.response.data)
    }
)

export default api