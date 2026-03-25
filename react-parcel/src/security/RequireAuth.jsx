import { Navigate,useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({children}) => {
    const {user} = useAuth()
    const location = useLocation()
    if(!user){
        return (
            <Navigate to="/login2" replace state={{from: location}}/>
        );
    }

    return children
}

export default RequireAuth