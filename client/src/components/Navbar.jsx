import { Menu, Printer } from "lucide-react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();

  // Helper function to blur active element, causing DaisyUI dropdowns to close on click
  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Navigation Links List
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Host", path: "/host" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-200 bg-base-100/80 backdrop-blur-md transition-all">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Navbar Start: Mobile Menu + Logo */}
        <div className="navbar-start gap-2">
          {/* Mobile Dropdown */}
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content mt-3 z-50 p-2 shadow-2xl bg-base-100 border border-base-200 rounded-2xl w-56 gap-1"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={closeDropdown}
                      className={isActive ? "active font-semibold" : "font-medium"}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Brand Logo */}
          <Link
            to="/"
            className="btn btn-ghost text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 hover:bg-transparent px-1"
          >
            <div className="p-1.5 rounded-xl bg-primary text-primary-content">
              <Printer size={18} />
            </div>
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">
              Pinchop
            </span>
          </Link>
        </div>

        {/* Navbar End: Desktop Links */}
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`rounded-xl font-medium transition-all ${
                      isActive ? "active font-semibold" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </header>
  );
};

export default Navbar;