import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import $ from 'jquery'
import Alert from '../layout/Alert';
import { useParams, useHistory } from 'react-router-dom'
import { baseURL } from '../../helper/constants/axiosInstanceUser'

const UpdatePassword = () => {
    const params = useParams()
    let  passToken = params.id?params.id:"";
   
    let finalImageUrl=""
    let prefix = process.env.REACT_APP_ROUTE_PREFIX;
    prefix=prefix.trim();
    if(prefix!="")
    {
        let arr=prefix.split("/")
        if(arr[0]!=undefined && (arr[0]==""))
        {
            finalImageUrl=prefix+"/";
        }
        else{
            finalImageUrl="/"+prefix+"/";
        }
       
    }


    const [userEmail, setUserEmail] = useState('')
    const [validateEmail, setValidateEmail] = useState('')
    const [submitForm, setSubmitForm] = useState(false)
    const [error, seterror] = useState({})
    const [isSubmit, setisSubmit] = useState(false)
    const [alert, setAlert] = useState(null)
    const [isLinkValid, setisLinkValid] = useState(false)

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


    const checkValidLink=()=>{

        const body = user;
        axios.get(`${baseURL}/users/forgotPasswordLinkVerify/${passToken}`, body)
            .then((response) => {
               
                if (response.data.status === "success") {
                   // showAlert(response.data.message, "success")

                   if (response.data.data.type === "valid") {
                      setisLinkValid(true);
                   }

                  // console.log("res ponse",response.data)
                   if (response.data.data.userdata  && response.data.data.userdata.email) {

                   // console.log("inner datatatta ",response.data.data.userdata.userEmail)
                    setUser({...user,emailId:response.data.data.userdata.email})
                   }
                  
                  
                }
                else {
                    showAlert(response.data.message, "danger")
                    setisLinkValid(false);
                    setTimeout(() => {
                        window.location.href= prefix + "/";
                    }, 2000);
                }
            }).catch((error) => {
                showAlert(error.response.data.error, "danger")
                setTimeout(() => {
                    window.location.href= prefix + "/";
                }, 2000);
            });
   


    }

    useEffect(()=>{
        checkValidLink()
    },[])

    const updatePassword = () => {
        setisSubmit(true)
        seterror(validation(user))
        //setValidateEmail(validateEmailform(user));
    }
    const validation = (values) => {

        console.log("submit datat ",values)
        const formErrors = {}
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.emailId) {
            formErrors.emailId  = "Please Enter a email"
        }
        // else if (!regex.test(values)) {
        //     formErrors.emailId  = "Please enter a valid email .";
        // }

        if (!values.newPassword) {
            formErrors.newPassword  = "Password is required"
        }else{
            const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if(!pwdRegex.test(values.password)){
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


        return formErrors
    }
    useEffect(() => {
        console.log(error);
    // if(submitForm && validateEmail==''){
    if (Object.keys(error).length == 0 && isSubmit) {

       console.log(error);

        const body = user;
        axios.post(`${baseURL}/users/updateForgotPassword`, body)
            .then((response) => {
                console.log(response.data);
                if (response.data.status === "success") {
                    showAlert(response.data.message, "success")

                    setTimeout(() => {
                        window.location.href= prefix + "/";
                    }, 2000);
                   
                  
                }
                else {
                    showAlert(response.data.message, "danger")
                    setTimeout(() => {
                        window.location.href= prefix + "/";
                    }, 2000);
                }
            }).catch((error) => {
                showAlert(error.response.data.error, "danger")
                setTimeout(() => {
                    window.location.href= prefix + "/";
                }, 2000);
            });
    }


    }, [error])


    const showAlert = (message, type) => {
        setAlert({
            message: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null)
        }, 2000);
    }
    
    return (

   <>     
       


<div className="d-md-flex h-100 login-wrapper bg-white" >
<div className="col-xl-6 col-md-5 d-flex align-items-center p-0 bg-dark text-white text-center">
    <div className="w-100 p-3">
        <h4 className="mb-4">WELCOME TO</h4>
        <img src={`${finalImageUrl}img/logo-cero-white.png`} className='login-logo' alt=""></img>
    </div>
</div>


{ isLinkValid?
<div className="col-xl-6 col-md-7 d-flex align-items-center bg-white">
    <div className="login-form p-xl-0 p-md-5 p-4 col-xl-7 m-auto">
        <h4 className="text-primary text-uppercase mb-3">Forgot Password</h4>
        <Alert alert={alert} />
        <div className="form-group mb-4 input-user">
                 <input type="password" placeholder="New password" className="form-control"
                                onChange={onChange}
                                value={user.newPassword}
                                name="newPassword"
                            />
                            <p className="text-red">{error.newPassword}</p>
        </div>


        <div className="form-group mb-4 input-user">
                 <input type="password" placeholder="Confirm Password" className="form-control"
                                onChange={onChange}
                                value={user.confirmPassword}
                                name="confirmPassword"
                     />
                    <p className="text-red">{error.confirmPassword}</p>
        </div>
      
        <div className="d-flex align-items-center">
        <button className="btn btn-secondary ml-auto" onClick={updatePassword}>Update Password</button>
        </div>
    </div>
</div>
 : <div className="col-6"><p className="text-red">Link is not valid</p></div>}



</div>

</>
    )
}

export default UpdatePassword