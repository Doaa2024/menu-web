import { NavLink } from "react-router-dom";
import { FiHome, FiShoppingCart, FiBox, FiGrid, FiLogOut } from "react-icons/fi";
import './SideBar.css'
export function SideBar({isSidebarOpen,setIsSidebarOpen}){
    return(
        <>
        {isSidebarOpen &&
 <div className="sidebar">
  <div className="sidebarTop">
    <h2>Admin Portal</h2>
    <span className="closeBtn" onClick={() => setIsSidebarOpen(false)}>&times;</span>
  </div>

  <div className="sidebarMenu">
    <div className="menuSection">
      <div className="menuIndicator">Overview</div>
      <NavLink to="/" className={({ isActive }) => isActive ? "sidebarItem active" : "sidebarItem"}>
        <FiHome />
        <span>Dashboard</span>
      </NavLink>
    </div>

    <div className="menuSection">
      <div className="menuIndicator">Management</div>
      <NavLink to="/orders" className={({ isActive }) => isActive ? "sidebarItem active" : "sidebarItem"}>
        <FiShoppingCart />
        <span>Orders</span>
      </NavLink>

      <NavLink to="/products" className={({ isActive }) => isActive ? "sidebarItem active" : "sidebarItem"}>
        <FiBox />
        <span>Products</span>
      </NavLink>

      <NavLink to="/categories" className={({ isActive }) => isActive ? "sidebarItem active" : "sidebarItem"}>
        <FiGrid />
        <span>Categories</span>
      </NavLink>
    </div>
  </div>

  <div className="sidebarBottom">
    <div className="logoutAdmin">
      <FiLogOut />
      Logout
    </div>
  </div>
</div>}
        </>
    )
}