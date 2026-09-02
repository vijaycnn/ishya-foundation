import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Nav, Image, Button } from "react-bootstrap";
import logo from "../assets/logo.svg";
import {
  BiGridAlt,
  BiGroup,
  BiLogOut,
  BiInfoSquare,
  BiListUl,
  BiUser, BiImages, BiUpload, BiSliderAlt
} from "react-icons/bi";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();app-login-logo
    navigate(adminAlias);
  };
  const isActive = (paths) => {
    const currentPath = location.pathname;
    
    const pathList = Array.isArray(paths) ? paths : [paths];
    return pathList.some(path =>
      currentPath === path || currentPath.startsWith(path + "/")
    );
  };
  //to manage menu access //it's static part. update part uploaded soon...
  const userEmail = localStorage.getItem("userEmail");
  let hasAccess = true;
  if(userEmail == 'info@havellsmyousic.com'){
    hasAccess = false;
  }

  return (
    <>
      <aside className="app-sidebar">
        <Link className="app-sidebar-logo" to={`${adminAlias}/dashboard`}>
          {/* <Image src={logo} alt="" /> */}
          Ishya-Foundation
        </Link>
        <div className="app-sidebar-nav">
          <Nav className="flex-column">
            <Link
              to={`${adminAlias}/dashboard`}
              className={`nav-link ${
                isActive(`${adminAlias}/dashboard`) ? "active" : ""
              }`}
            >
              <span className="nav-link-icon">
                <BiGridAlt />
              </span>
              <span className="nav-link-text">Dashboard</span>
            </Link>
            <Link to={`${adminAlias}/participant`} className={`nav-link ${ isActive(`${adminAlias}/participant`) ? "active" : "" }`} >
              <span className="nav-link-icon">
                <BiUser />
              </span>
              <span className="nav-link-text">Participant</span>
            </Link>
            {
              (hasAccess) ?
              <>
              <Link to={`${adminAlias}/banner`} className={`nav-link ${ (isActive([`${adminAlias}/banner`, `${adminAlias}/addBanner`, `${adminAlias}/editBanner`]) ) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiImages />
                </span>
                <span className="nav-link-text">Banner</span>
              </Link>

              <Link to={`${adminAlias}/mentors`} className={`nav-link ${ isActive([`${adminAlias}/mentors`, `${adminAlias}/addMentor`, `${adminAlias}/editMentor`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiGroup />
                </span>
                <span className="nav-link-text">Mentors</span>
              </Link>
              <Link to={`${adminAlias}/galleries`} className={`nav-link ${ isActive([`${adminAlias}/galleries`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiSliderAlt />
                </span>
                <span className="nav-link-text">Galleries</span>
              </Link>
              <Link to={`${adminAlias}/slides`} className={`nav-link ${ isActive([`${adminAlias}/slides`, `${adminAlias}/addSlide`, `${adminAlias}/editSlide`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiGroup />
                </span>
                <span className="nav-link-text">CMS Context</span>
              </Link>

              <Link to={`${adminAlias}/artistusp`} className={`nav-link ${ isActive([`${adminAlias}/artistusp`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiSliderAlt />
                </span>
                <span className="nav-link-text">ArtistUsp BackGround</span>
              </Link>

              <Link to={`${adminAlias}/bootcamp`} className={`nav-link ${ isActive([`${adminAlias}/bootcamp`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiSliderAlt />
                </span>
                <span className="nav-link-text">Bootcamp BackGround</span>
              </Link>
              <Link to={`${adminAlias}/guideline`} className={`nav-link ${ isActive([`${adminAlias}/guideline`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiUpload />
                </span>
                <span className="nav-link-text">Upload Guideline</span>
              </Link>
              <Link to={`${adminAlias}/faqs`} className={`nav-link ${ isActive([`${adminAlias}/faqs`, `${adminAlias}/addFaq`, `${adminAlias}/editFaq`]) ? "active" : ""}`} >
                <span className="nav-link-icon">
                  <BiInfoSquare />
                </span>
                <span className="nav-link-text">Faqs</span>
              </Link>
              <Link to={`${adminAlias}/category`} className={`nav-link ${ isActive([`${adminAlias}/category`, `${adminAlias}/addCategory`, `${adminAlias}/editCategory`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiListUl />
                </span>
                <span className="nav-link-text">Faq Category</span>
              </Link>
              </>: ''
            }            
          </Nav>
        </div>
        <div className="w-100 p-3">
          <Button
            variant="primary btn-icon"
            title="Logout"
            onClick={handleLogout}
          >
            <span>
              <BiLogOut size={18} color="white" />
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
