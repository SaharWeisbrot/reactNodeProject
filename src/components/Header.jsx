import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header__wrap">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="logo" />
              <span className="slogan">nell'appetito</span>
            </Link>
          </div>
          <nav>
            <ul className="menu">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                  end
                >
                  תפריט
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  מנות מומלצות
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  אזור אישי
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
