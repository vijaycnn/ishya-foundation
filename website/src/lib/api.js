// lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_BASE_URL = process.env.API_BASE_URL;

const callAPI = async (endURL)=> {
    if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not configured");
    }

  const response = await fetch(`${API_BASE_URL}${endURL}`,{
      next: {
        revalidate: 300, // 5 minutes
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch menu");
  }

  return response.json();
}

export async function getMenu() {
  const result = await callAPI(`/program/menuList`);
  return result;
}

export async function getHomePage() { 
  
  const result = await callAPI(`/page/detail/home`);
  
  // console.log('UI home >>>>', result?.data?.[0])

  if (result?.status !== "success") {
    throw new Error(
      result?.message || "Failed to fetch home page data"
    );
  }

//   console.log("HOME API RESULT >>>", result);
  console.log("HOME PAGE LIST >>>", result?.data[0]);
//   console.log("partners >>>", result?.data[0]?.partners);
  return result?.data?.[0] || null;
}
