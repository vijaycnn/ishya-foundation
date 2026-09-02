import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND;

let genToken = {
    generateTokenAuth: async (refToken) => {            
        let body = {refreshToken:refToken};
        // const authToken = localStorage.getItem('auth-token')
        let apiRes= await axios.post(baseURL+"/api/user/regenerateToken",
            body).then(async (res)=>{
                if(res.data  && (res.data.status === 'true'))
                {
                    let token= res.data.data.token;
                        if(token)
                        {
                            localStorage.setItem("auth-token", token)
                        // window.location.reload();
                        }
                }
                else{ 
                    console.log('regenerateToken >>', res)
                    // return {status:false,token:null};
                }
                // return {status:true,accessToken:null}                
            }).catch((error)=>{
                console.log('regenerateTokenErr >>', error)
                //return {status:false,token:null};
            });

    }
  };
  
  export default genToken;