import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/Header.css";

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header__wrap">
          <div className="logo">
            <Link to="/mainPage">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <nav>
            <ul className="menu">
              <li>
                <NavLink
                  to="/mainPage"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                  end
                >
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  contact
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
