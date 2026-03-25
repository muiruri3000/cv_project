import { Outlet } from "react-router-dom"
import Aside from "./aside/Aside"
import Main from "./main/Main"
const DashboardLayout = () => {
    return <div className="pt-[32px] flex h-screen"> 
        
        <Aside />
        <Main>
            <Outlet />
        </Main>

    </div>
}

export default DashboardLayout