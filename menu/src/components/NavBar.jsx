import './NavBar.css'
import logo from '../assets/Screenshot 2026-05-21 154523.png'
function NavBar() {
    return (
  <nav className="navBar">
  <img src={logo} alt="Logo" className="logo" />
</nav>
    )
}
export default NavBar