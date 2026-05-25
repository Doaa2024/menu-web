import './NavBar.css'
import { FiMenu,FiLogOut } from 'react-icons/fi'
export function NavBar({ setIsSidebarOpen }) {
  return (
    <div className="navbar">
      <button className='sideBar' onClick={() => setIsSidebarOpen(true)}>
        <FiMenu />
      </button>
      <button className='logout'>
        <FiLogOut />Logout
      </button>
    </div>
  )
}   
export default NavBar