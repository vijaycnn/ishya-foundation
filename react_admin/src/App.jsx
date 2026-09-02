import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./scss/main.scss";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Forgot from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Participate from "./pages/Participate";
import Faqs from "./pages/master/Faq";
import AddFaq from "./pages/master/AddFaq";
import EditFaq from "./pages/master/EditFaq";
import FaqCategory from "./pages/master/FaqCategory";
import AddFaqCategory from "./pages/master/AddFaqCategory";
import EditFaqCategory from "./pages/master/EditFaqCategory";

import Mentors from "./pages/master/Mentor";
import AddMentor from "./pages/master/AddMentor";
import EditMentor from "./pages/master/EditMentor";
import Banner from "./pages/master/Banner";
import AddBanner from "./pages/master/AddBanner";
import EditBanner from "./pages/master/EditBanner";

import Slides from "./pages/master/Slide";
import AddSlide from "./pages/master/AddSlide";
import EditSlide from "./pages/master/EditSlide";
import Gallery from "./pages/master/Gallery";
import Artistusp from "./pages/master/Artistusp";
import Bootcamp from "./pages/master/Bootcamp";
import Guideline from "./pages/master/Guideline";

const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [azureUser, setAzureUser] = useState(true);

  const handleAuthStateChange = (isAuth, user) => {
    setIsAuthenticated(isAuth);
    if (isAuth && user) {
      setAzureUser(user);
    } else {
      setAzureUser(null);
    }
  };
  return (
    <>
      <Router>
        <Routes>
          <Route
            path={adminAlias}
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                onAuthStateChange={handleAuthStateChange}
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Forgot/>
            }
          />
          <Route
            path={`${adminAlias}/forgot-password-update/:id`}
            element={
              <UpdatePassword />
            }
          />
          <Route
            path={`${adminAlias}/dashboard`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/participant`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Participate />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path={`${adminAlias}/banner`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Banner />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/addBanner`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <AddBanner />
                </Layout>
              </ProtectedRoute>
            }
          /> 
          <Route
            path={`${adminAlias}/editBanner/:id`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <EditBanner />
                </Layout>
              </ProtectedRoute>
            }
          />   
          <Route
            path={`${adminAlias}/galleries`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Gallery />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/artistusp`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Artistusp />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/bootcamp`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Bootcamp />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/guideline`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Guideline />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/mentors`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Mentors />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/addMentor`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <AddMentor />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/editMentor/:id`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <EditMentor />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/faqs`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Faqs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/addFaq`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <AddFaq />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/editFaq/:id`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <EditFaq />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/category`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <FaqCategory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/addCategory`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <AddFaqCategory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/editCategory/:id`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <EditFaqCategory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path={`${adminAlias}/slides`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Slides />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/addSlide`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <AddSlide />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={`${adminAlias}/editSlide/:id`}
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <EditSlide />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* <Route path="*" element={<Navigate to="/admin" />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
