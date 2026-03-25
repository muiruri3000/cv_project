import { useState } from "react";
import { apiFetch } from "../loginHelper/api";
import { useAuth } from "../../security/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/axios";


const Login2 = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {



            const response = await api.post("/token/", {
                username,password
            })
            
          

           const data = response.data;
            const payload = JSON.parse(atob(data.access.split(".")[1]))
            const userData = {
                username: payload.username, 
                role: payload.role
            }
            login(userData);
           

            // ✅ Store tokens here
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            navigate("/dashboard",{state:{message: "login successful"}})
        } catch (error) {
            let msg = 'login failed'
            if (typeof error === "string"){
                msg = error; 
            } else if (error.response){
                if(error.response.status === 401) {msg ="Invalid username or password";
                }else{
                    msg = error.response.data.detail || "Something went wrong. "
                }
            }
            setError(msg);
            setTimeout(()=>setError(null), 1500)
        }
    };

    return (
        <div className="mt-5">
            <h2>Login</h2>
                 {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login2;