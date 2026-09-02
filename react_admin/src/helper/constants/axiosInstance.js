import moment from "moment";
import axios from "axios";
// import jwt_decode from "jwt-decode";
import genToken from "./regenerateToken";

const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND+'/api';
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const homeRoute = import.meta.env.VITE_API_HOME_ROUTE+adminAlias;
let authToken = localStorage.getItem("auth-token");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bareer ${authToken}`,
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  if (localStorage.getItem("auth-token")) {
    authToken = localStorage.getItem("auth-token");
    req.headers.Authorization = `Bareer ${localStorage.getItem("auth-token")}`;
    // const user = jwt_decode(authToken);

    // let issuedEpoch = parseInt(user.iat);
    // let expEpoch = parseInt(user.exp);
    // let currentEpoch = parseInt(moment().unix());

    // let issuedEpochDiff = currentEpoch - issuedEpoch;
    // let expEpochDiff = expEpoch - currentEpoch;

    // if (issuedEpochDiff > 60 && expEpochDiff > 0) {
    //   await genToken.generateTokenAuth(authToken);
    // }

    // if (expEpochDiff <= 0) {
    //   logout();
    // }

    return req;
  } else {
    window.location.href = homeRoute;
  }
});
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // return Promise.reject(error);
    if (error.response.data.invalid_access === 1) {
      window.location.href = "/dashboard";
    } else {
      return Promise.reject(error);
    }
  }
);
const logout = ()=>{
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
}

export default axiosInstance;
