import { Menu } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu />
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>

            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">Pinchop</a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to={"/"}> Home</Link>
          </li>

          <li>
            <Link to={"/pricing"}> Pricing</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
