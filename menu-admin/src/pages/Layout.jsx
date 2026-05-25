import { Outlet } from "react-router-dom";
import {useState} from "react";
import NavBar from "../components/NavBar";
import { SideBar } from "../components/SideBar";
function Layout() {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return(
        <>
        <NavBar setIsSidebarOpen={setIsSidebarOpen}/>
        <SideBar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen}/>
        <Outlet/>
        </>
    );}
export default Layout;