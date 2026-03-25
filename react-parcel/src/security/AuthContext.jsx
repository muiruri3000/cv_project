import { createContext, useContext, useState } from "react"


export const AuthContext = createContext(null); 
export const AuthProvider = ({children}) => {
const [user, setUser] = useState(()=>{
    const stored = localStorage.getItem("user");
    return stored?JSON.parse(stored) : null;
})


const login = (userData) =>{
    
    
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("AuthContext user state:", user);
};
const logout  = () =>  {


    setUser(null);
    localStorage.removeItem("user")
};
return <AuthContext.Provider value={{user, login, logout}}>
    {children}
</AuthContext.Provider>
}


export const useAuth = () =>{return useContext(AuthContext)}