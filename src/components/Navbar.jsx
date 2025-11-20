import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="flex gap-4">
  <Link to="/">Home</Link>
  <Link to="/products">Products</Link>
  <Link to="/Details">Categories</Link>
  <Link to="/about">About</Link>
  <Link to="/contact">Contact</Link>
  <Link to="/login">Login</Link>
</nav>

  )
}

export default Navbar