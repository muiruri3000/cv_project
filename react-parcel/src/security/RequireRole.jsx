import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireRole = ({allowedRoles, children}) => {
    const {user} = useAuth()

 
    if(!allowedRoles.includes(user.role)){
        return (
            <Navigate to="/unauthorized" replace/>
        );
    }
    return children
}

export default RequireRole