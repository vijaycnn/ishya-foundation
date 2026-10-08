import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Nav, Image, Button } from "react-bootstrap";
import logo from "../assets/IshyaLogo.png";
import {
  BiGridAlt,
  BiLogOut,
  BiImages,
  BiCommentDetail,
  BiFile,
  BiCarousel,
  BiNews,
  BiWindowAlt, BiInfoSquare
} from "react-icons/bi";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };
  const isActive = (paths) => {
    const currentPath = location.pathname;

    const pathList = Array.isArray(paths) ? paths : [paths];
    return pathList.some(
      (path) => currentPath === path || currentPath.startsWith(path + "/"),
    );
  };
  //to manage menu access //it's static part. update part uploaded soon...
  const userEmail = localStorage.getItem("userEmail");
  let hasAccess = true;
  if (userEmail == "info@havellsmyousic.com") {
    hasAccess = false;
  }

  return (
    <>
      <aside className="app-sidebar">
        <Link className="app-sidebar-logo" to={`${adminAlias}/dashboard`}>
          <Image src={logo} alt="" />
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

            {hasAccess ? (
              <>
                {/* <Link
                  to={`${adminAlias}/banner`}
                  className={`nav-link ${isActive([`${adminAlias}/banner`, `${adminAlias}/addBanner`, `${adminAlias}/editBanner`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiCarousel />
                  </span>
                  <span className="nav-link-text">Banner</span>
              </Link> */}
              <Link to={`${adminAlias}/homepage`} className={`nav-link ${ isActive([`${adminAlias}/homepage`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiImages />
                </span>
                <span className="nav-link-text">Home Page</span>
                </Link>

              <Link to={`${adminAlias}/aboutpage`} className={`nav-link ${ isActive([`${adminAlias}/aboutpage`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiImages />
                </span>
                <span className="nav-link-text">About Page</span>
                </Link>

              <Link to={`${adminAlias}/donatepage`} className={`nav-link ${ isActive([`${adminAlias}/donatepage`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiImages />
                </span>
                <span className="nav-link-text">Donate Page</span>
              </Link>

                <Link
                  to={`${adminAlias}/programs`}
                  className={`nav-link ${isActive([`${adminAlias}/programs`, `${adminAlias}/addProgram`, `${adminAlias}/editProgram`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiCommentDetail />
                  </span>
                  <span className="nav-link-text">Programs</span>
                </Link>

                <Link
                  to={`${adminAlias}/testimonials`}
                  className={`nav-link ${isActive([`${adminAlias}/testimonials`, `${adminAlias}/addTestimonial`, `${adminAlias}/editTestimonial`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiCommentDetail />
                  </span>
                  <span className="nav-link-text">Testimonials</span>
                </Link>

                <Link
                  to={`${adminAlias}/learningpages`}
                  className={`nav-link ${isActive([`${adminAlias}/learningpages`, `${adminAlias}/addLearningPage`, `${adminAlias}/editLearningPage`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiFile />
                  </span>
                  <span className="nav-link-text">Learning Pages</span>
                </Link>
                <Link
                  to={`${adminAlias}/galleries`}
                  className={`nav-link ${isActive([`${adminAlias}/galleries`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiImages />
                  </span>
                  <span className="nav-link-text">Galleries</span>
                </Link>


                <Link
                  to={`${adminAlias}/partners`}
                  className={`nav-link ${isActive([`${adminAlias}/partners`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiImages />
                  </span>
                  <span className="nav-link-text">Partners</span>
                </Link>

                <Link
                  to={`${adminAlias}/blogs`}
                  className={`nav-link ${isActive([`${adminAlias}/blogs`, `${adminAlias}/addBlog`, `${adminAlias}/editBlog`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiNews />
                  </span>
                  <span className="nav-link-text">Blogs</span>
                </Link>

                <Link
                  to={`${adminAlias}/news`}
                  className={`nav-link ${isActive([`${adminAlias}/news`, `${adminAlias}/addNews`, `${adminAlias}/editNews`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiNews />
                  </span>
                  <span className="nav-link-text">News</span>
                </Link>

                <Link
                  to={`${adminAlias}/newsletters`}
                  className={`nav-link ${isActive([`${adminAlias}/newsletters`, `${adminAlias}/addNewsLetter`, `${adminAlias}/editNewsLetter`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiNews />
                  </span>
                  <span className="nav-link-text">NewsLetters</span>
                </Link>

                <Link to={`${adminAlias}/contactpage`} className={`nav-link ${ isActive([`${adminAlias}/contactpage`]) ? "active" : "" }`} >
                  <span className="nav-link-icon">
                    <BiImages />
                  </span>
                  <span className="nav-link-text">ContactUs Page</span>
                </Link> 

                <Link to={`${adminAlias}/faqs`} className={`nav-link ${ isActive([`${adminAlias}/faqs`, `${adminAlias}/addFaq`, `${adminAlias}/editFaq`]) ? "active" : ""}`} >
                  <span className="nav-link-icon">
                    <BiInfoSquare />
                  </span>
                  <span className="nav-link-text">Faqs</span>
                </Link>

                <Link
                  to={`${adminAlias}/slides`}
                  className={`nav-link ${isActive([`${adminAlias}/slides`, `${adminAlias}/addSlide`, `${adminAlias}/editSlide`]) ? "active" : ""}`}
                >
                  <span className="nav-link-icon">
                    <BiWindowAlt />
                  </span>
                  <span className="nav-link-text">CMS Context</span>
                </Link>

                {/* <Link to={`${adminAlias}/artistusp`} className={`nav-link ${ isActive([`${adminAlias}/artistusp`]) ? "active" : "" }`} >
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
              <Link to={`${adminAlias}/category`} className={`nav-link ${ isActive([`${adminAlias}/category`, `${adminAlias}/addCategory`, `${adminAlias}/editCategory`]) ? "active" : "" }`} >
                <span className="nav-link-icon">
                  <BiListUl />
                </span>
                <span className="nav-link-text">Faq Category</span>
              </Link> */}
              </>
            ) : (
              ""
            )}
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
