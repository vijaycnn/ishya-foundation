import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Image, Form, Button, Alert } from "react-bootstrap";
import logo from "../assets/IshyaLogo.png";
import wallpaper from "../assets/wallpaper.jpg";
import { login } from "../api";
import { decode as base64_decode, encode as base64_encode } from "base-64";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

const Login = ({ setIsAuthenticated, onAuthStateChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ Added password state
  const [error, setError] = useState(null);
  const [azureUser, setAzureUser] = useState(true);
  const navigate = useNavigate();

  const showAlert = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (email != "" && password != "") {
      const body = {
        email: email,
        password: base64_encode(password),
      };
      let result = await login(body);
      // console.log('>>> ', result);
      if (result?.status == "success") {
        if (result?.data) {
          const authToken = result.data.token;
          const userName = result.data.userName;
          const userEmail = result.data.userEmail;
          localStorage.setItem("auth-token", authToken);
          localStorage.setItem("userName", userName);
          localStorage.setItem("userEmail", userEmail);

          setIsAuthenticated(true);
          sessionStorage.setItem("isAuthenticated", "true");
          if (onAuthStateChange) {
            onAuthStateChange(true, {
              name: userName,
              username: userEmail,
              localAccountId: "email-admin",
            });
          }
          navigate(`${adminAlias}/dashboard`);
        }
      } else if (result?.status == "error") {
        showAlert(result?.message);
      }
    } else {
      showAlert("Invalid email or password");
    }

    // // ✅ Dummy credentials
    // const dummyEmail = "admin@gmail.com";
    // const dummyPassword = "admin123";

    // // ✅ Validation check
    // if (email === dummyEmail && password === dummyPassword) {
    //   setIsAuthenticated(true);
    //   sessionStorage.setItem("isAuthenticated", "true");

    //   if (onAuthStateChange) {
    //     onAuthStateChange(true, {
    //       name: "Admin User",
    //       username: "admin@gmail.com",
    //       localAccountId: "email-admin",
    //     });
    //   }

    //   navigate("/dashboard");
    // } else {
    //   setError("Invalid email or password");
    // }
  };

  return (
    <section className="h-100 app-login d-flex">
      <div className="app-login-left flex-grow-1">
        <div className="wallpaper">
          <Image src={wallpaper} alt="" height={400} width={250} />

          <div className="wallpaper-caption">
            <h1>
              Let Us Come Together
              <br />
              To Make a Difference
            </h1>
          </div>
        </div>
      </div>

      <div className="app-login-right d-flex flex-column align-items-center justify-content-center p-5">
        <div className="app-login-logo">
          <Image src={logo} alt="Logo" />
        </div>
        <Form
          onSubmit={handleEmailLogin}
          className="app-login-form d-grid gap-4"
        >
          <div className="sec-head">
            <h2 className="sec-title fs-2">Welcome Back, Admin!</h2>
            <p className="fw-medium opacity-50">
              Sign in to continue managing your platform and keeping everything
              running smoothly.
            </p>
          </div>

          {/* Error Message */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Email Field */}
          <Form.Group>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your Email ID"
              value={email}
              size="lg"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Password Field */}
          <Form.Group>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={password}
              size="lg"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {/* Submit Button */}
          <Form.Group>
            <p className="text-end mb-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <Button type="submit" variant="primary" className="w-100" size="lg">
              <span>Continue</span>
            </Button>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default Login;
