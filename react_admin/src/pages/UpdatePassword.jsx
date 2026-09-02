import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Image, Form, Button, Alert } from "react-bootstrap";
import logo from "../assets/logo.svg";
import wallpaper from "../assets/wallpaper.jpg";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
import { forgotPasswordLinkVerify, updateForgotPassword } from "../api";

const UpdatePassword = () => {
    const params = useParams()
    let  passToken = params.id?params.id:"";
    const navigate = useNavigate();

    const [isSubmit, setisSubmit] = useState(false)
    const [isLinkValid, setisLinkValid] = useState(false)
    const [error, seterror] = useState({})
    // const [alert, setAlert] = useState(null)

    const [user, setUser] = useState({
        emailId: "",
        resetPasswordToken: passToken,
        newPassword:"",
        confirmPassword:""
    })

    const onChange = (e) => {
        seterror({})
        setisSubmit(false)
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const checkValidLink= async()=>{
        try{
          let result = await forgotPasswordLinkVerify(passToken);
        //   console.log('res >>', result);
          if(result?.status == "success" ){
            if(result?.data?.type == "valid" ){  
                setisLinkValid(true);
            }
            if(result?.data?.userdata && result?.data?.userdata?.email){
                setUser({...user,emailId: result?.data?.userdata?.email})
            }            
          }else{
            showAlert(result?.message)
          }
        }catch(err){
          showAlert(err)
        }
    }

    useEffect(()=>{
        checkValidLink()
    },[])

    const updatePassword = async (e) => {
        e.preventDefault();
        setisSubmit(true)
            console.log('user', user);

        seterror(validation(user));

        if (Object.keys(error).length == 0 && isSubmit) {
            console.log(error);
            try{
                const body = user;

                let result = await updateForgotPassword(body);
                  console.log('res >>', result);
                if(result?.status == "success" ){
                    showAlert(result?.message)
                    navigate(adminAlias);           
                }else{
                    showAlert(result?.message)
                }
            }catch(err){
                showAlert(err)
            }
        }
    }
    const validation = (values) => {
        console.log("submit datat ",values)
        const formErrors = {}
        if (!values.emailId) {
            formErrors.emailId  = "Please Enter a email"
        }

        if (!values.newPassword) {
            formErrors.newPassword  = "Password is required"
        }else{
            const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
            if(!pwdRegex.test(values.newPassword)){
                formErrors.newPassword = "Password contains 1 Uppercase letter, 1 lowercase letter, 1 number, 1 special character and minimum length should be 8";
            }
        }
        if (!values.confirmPassword) {
            formErrors.confirmPassword  = "Confirm password is required"
        }
        if(values.newPassword !=values.confirmPassword)
        {
            formErrors.confirmPassword  = "Confirm password is not match"
        }
        seterror(formErrors);
        return formErrors
    }

    const showAlert = (message) => {
        seterror({message});
        setTimeout(() => {
        seterror(null);
        }, 2000);
    };
    // const showAlert = (message, type) => {
    //     setAlert({
    //         message: message,
    //         type: type
    //     })
    //     setTimeout(() => {
    //         setAlert(null)
    //     }, 2000);
    // }


  return (
    <section className="h-100 app-login d-flex">
      <div className="app-login-left flex-grow-1">
        <Image src={wallpaper} alt="Login Wallpaper" />
      </div>

      <div className="app-login-right bg-white d-flex flex-column align-items-center justify-content-center p-5">
        { isLinkValid?
            
            <div className="app-login-form d-grid gap-4">
                <div className="sec-head mb-4">
                <Image className="app-login-logo mb-5 d-block" src={logo} alt="Logo"/>
                <h2 className="sec-title fs-2">Update Password?</h2>
                </div>
                {/* Error Message */}
                {error && error.message  && <Alert variant="danger">{error.message}</Alert>}
                <Form onSubmit={ updatePassword} className="login-form p-xl-0 p-md-5 p-4 col-xl-12 m-auto">
                    {/* <Alert alert={alert} /> */}
                    <Form.Group>
                        <Form.Control
                            type="password"
                            placeholder="Enter New Password"
                            onChange={onChange}
                            value={user.newPassword}
                            name="newPassword"
                            size="lg"
                        />
                        <p className="text-danger">{error ? error.newPassword : ''}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            onChange={onChange}
                            value={user.confirmPassword}
                            name="confirmPassword"
                            size="lg"
                        />
                        <p className="text-danger">{error ? error.confirmPassword : ''}</p>
                    </Form.Group>
                    
                    <Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100 pill"
                            size="lg"
                        >
                            <span>Submit</span>
                        </Button>
                    </Form.Group>
                </Form>
            </div>
            : 
            <><div className="app-login-form d-grid gap-4">
                <div className="sec-head mb-4">
                    <Image className="app-login-logo mb-5 d-block" src={logo} alt="Logo"/>
                    <h2 className="sec-title fs-2">Update Password?</h2>
                    <h4 className="sec-sub-title fw-medium text-danger">
                        Link is not valid
                    </h4>
                </div>     
                </div>
            </> }
      </div>
    </section>
  );
};

export default UpdatePassword;