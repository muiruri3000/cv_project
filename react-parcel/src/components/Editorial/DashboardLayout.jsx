import { Outlet } from "react-router-dom"
import Aside from "./aside/Aside"
import Main from "./main/Main"
const DashboardLayout = () => {
    return <div className=" flex h-screen"> 
         
        <Aside />
        <Main >
            <Outlet />
        </Main>

    </div>
}

export default DashboardLayout