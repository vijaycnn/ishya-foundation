const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND;
const authToken = localStorage.getItem("auth-token");


export const login = async (formData) => {
  const response = await fetch(`${baseURL}/api/user/login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json', // Indicate the data format being sent
    },
    body: JSON.stringify(formData),
  });
  return response.json();
};

export const generateForgotPasswordLink = async (body) => {
  const response = await fetch(`${baseURL}/api/user/generateForgotPasswordLink`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json', // Indicate the data format being sent
    },
    body: JSON.stringify(body),
  });
  return response.json();
};
export const updateForgotPassword = async (body) => {
  const response = await fetch(`${baseURL}/api/user/updateForgotPassword`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json', // Indicate the data format being sent
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const forgotPasswordLinkVerify = async (params) => {
  const response = await fetch(`${baseURL}/api/user/forgotPasswordLinkVerify/${params.toString()}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};
export const getDownloadUrl = async (key) => {
  if(key){
    const response = await fetch(`${baseURL}/api/enquiry/download-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });
    return await response.json();
  }
};
export const enquiryList = async (params) => {
  const response = await fetch(`${baseURL}/api/enquiry?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bareer ${authToken}`,
    },
  });
  return response.json();
};
export const stateList = async () => {
  const response = await fetch(`${baseURL}/api/location/stateList`, {
    method: "GET",
  });
  return response.json();
};
export const cityList = async (stateId) => {
  const response = await fetch(`${baseURL}/api/location/city/getByState/${stateId}`, {
    method: "GET",
  });
  return response.json();
};
