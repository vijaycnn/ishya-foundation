import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Image, Form, Button, Alert, CardText } from "react-bootstrap";
import logo from "../assets/logo.svg";
import wallpaper from "../assets/wallpaper.jpg";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
import { generateForgotPasswordLink } from "../api";
// import Alert from  "../components/Alert";

const Forgot = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('')
  const [validateEmail, setValidateEmail] = useState(null)
  const [submitForm, setSubmitForm] = useState(false)
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [alert, setAlert] = useState(null)

  const updatePassword = async(e) => {
      e.preventDefault();
      setSubmitForm(true)
      setValidateEmail(validateEmailform(userEmail));

      // console.log("updatePassword called",validateEmail)
      if(submitForm && validateEmail==''){
        console.log(userEmail);

        const body = { "emailId": userEmail }
        try{
          let result = await generateForgotPasswordLink(body);
          // console.log('res >>', result);
          if(result?.status == "success" ){
            showSuccessAlert(result?.message)
              setTimeout(() => {
                navigate(adminAlias);
              }, 2000); 
            
          }else{
            showAlert(result?.message)
          }
        }catch(err){
          showAlert(err)
        }
      }
  }
  const validateEmailform = (values) => {
      let formErr = ""
      const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!values) {
          formErr = "Please Enter a email"
      }
      else if (!regex.test(values)) {
          formErr = "Please enter a valid email";
      }
      setError(formErr);

      return formErr
  }
  // const showAlert = (message, type) => {
  //     setAlert({
  //         message: message,
  //         type: type
  //     })
  //     setTimeout(() => {
  //         setAlert(null)
  //     }, 2000);
  // }
  const showAlert = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };
  const showSuccessAlert = (message) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
  };

  return (
    <section className="h-100 app-login d-flex">
      <div className="app-login-left flex-grow-1">
        <Image src={wallpaper} alt="Login Wallpaper" />
      </div>

      <div className="app-login-right bg-white d-flex flex-column align-items-center justify-content-center p-5">
        <Form onSubmit={updatePassword} className="app-login-form d-grid gap-4">
          <div className="sec-head mb-4">
            <Image
              className="app-login-logo mb-5 d-block"
              src={logo}
              alt="Logo"
            />
            <h2 className="sec-title fs-2">Forgot Password?</h2>
            {/* <p className="sec-sub-title fw-medium">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Corporis, officiis?
            </p> */}
          </div>

          {/* Error Message */}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          {/* <Alert alert={alert} /> */}
          {/* <Alert alert="hello this is mesage" /> */}

          {/* Email Field */}
          <Form.Group>
            <Form.Control
              type="email"
              placeholder="Enter your Email ID"
              value={userEmail}
              size="lg"
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Form.Group>

          {/* Submit Button */}
          <Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 pill"
              size="lg"
            >
              <span>Submit</span>
            </Button>
            <p className="text-center mt-3">
              <Link to={adminAlias}>Back to Login</Link>
            </p>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default Forgot;
