import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../security/AuthContext"

const Login = () => {
    
    const {login} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || "/"
    


    const handleLogin = (role) => {
        login({
            id:1,
            name:"Test User",
            role
        }); 
        navigate(from, {replace:true});
    }
    return   <div className="p-8 mt-10 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <button
        onClick={() => handleLogin("admin")}
        className="block cursor-pointer w-full mb-2 bg-blue-600 text-white py-2 rounded"
      >
        Login as Admin
      </button>

      <button
        onClick={() => handleLogin("editor")}
        className="block w-full cursor-pointer mb-2 bg-green-600 text-white py-2 rounded"
      >
        Login as Editor
      </button>

      <button
        onClick={() => handleLogin("viewer")}
        className="block w-full cursor-pointer bg-gray-600 text-white py-2 rounded"
      >
        Login as Viewer
      </button>
    </div>
}

export default Login