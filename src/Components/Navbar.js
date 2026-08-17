import React, { useState } from "react";
import "../Styles/Navbar.css";
import Logo from "../Images/IshyaLogo.png";
import { FaSearch, FaHandsHelping, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = (menuName) => {
    setOpenMenus({ ...openMenus, [menuName]: true });
  };

  const handleMouseLeave = (menuName) => {
    setOpenMenus({ ...openMenus, [menuName]: false });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      label: "About Us",
      link: "/about-us/who-are-we",
      menu: ["Who are we", "Finances & Reporting", "Ishya Learning Centre"],
    },
    {
      label: "Our Programs",
      link: "/ourprograms",
      menu: [
        "All",
        "Education",
        "Health & Wellbeing",
        "Community Development",
        "Women Empowerment",
        "Environment",
        "Art & Culture",
      ],
    },
    {
      label: "Media & Coverage",
      link: "/media-&-coverage",
      menu: ["Gallery", "Blog", "News", "Newsletter"],
    },
    {
      label: "Contact Us",
      link: "/contactus",
    },
  ];

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-upper">
          <ul className="navbar-left">
            <li>
              <Link to="tel:9871005650">
                <span>+919871005650</span>
              </Link>
            </li>
          </ul>
          <ul className="navbar-right">
            <li>
              <Link to="/partnerships">Partnerships</Link>
            </li>
            <li>
              <Link to="/subscribe">Subscribe to our Newsletter</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-lower">
          <div className="mobile-logo-menu">
            {!isMobileMenuOpen && (
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className="logo"
                  style={{ width: "70px" }}
                />
              </Link>
            )}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <ul
            className={`menu-items ${isMobileMenuOpen ? "show-mobile-menu" : ""}`}
          >
            {
              <li className="desktop-logo">
                <Link to="/">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="logo"
                    style={{ width: "70px" }}
                  />
                </Link>
              </li>
            }
            {navItems.map((item) => (
              <li
                key={item.label}
                onMouseEnter={
                  item.menu ? () => handleMouseEnter(item.label) : null
                }
                onMouseLeave={
                  item.menu ? () => handleMouseLeave(item.label) : null
                }
                className={item.menu ? "has-menu" : ""}
              >
                <Link to={item.link} onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </Link>
                {item.menu && openMenus[item.label] && (
                  <ul className="dropdown-menu">
                    {item.menu.map((menuItem) => (
                      <li key={menuItem}>
                        <Link
                          to={`/${item.label.toLowerCase().replace(/ /g, "-")}/${menuItem.toLowerCase().replace(/ /g, "-")}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {menuItem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li className="navbar-support">
              <Link to="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="support-btn">
                  <FaHandsHelping style={{ marginRight: "10px" }} />
                  <span>Support a Cause</span>
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
