// lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_BASE_URL = process.env.API_BASE_URL;

const callAPI = async (endURL)=> {
    if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not configured");
    }
  const url = API_BASE_URL+endURL;
  console.log('API Endpoint >>>>', url);
  const response = await fetch(url,{
      next: {
        revalidate: 300, // 5 minutes
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch API data");
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

export async function getAboutPage() { 
  
  const result = await callAPI(`/page/detail/about`);
  
  // console.log('UI home >>>>', result?.data?.[0])

  if (result?.status !== "success") {
    throw new Error(
      result?.message || "Failed to fetch home page data"
    );
  }

//   console.log("HOME API RESULT >>>", result);
  console.log("ABOUT PAGE LIST >>>", result?.data[0]);
//   console.log("partners >>>", result?.data[0]?.partners);
  return result?.data?.[0] || null;
}

export async function getContactPage() { 
  
  const result = await callAPI(`/contactus/getPage`);
  
  // console.log('UI home >>>>', result?.data?.[0])

  if (result?.status !== "success") {
    throw new Error(
      result?.message || "Failed to fetch home page data"
    );
  }

//   console.log("HOME API RESULT >>>", result);
  console.log("CONTACT PAGE LIST >>>", result?.data[0]);
//   console.log("partners >>>", result?.data[0]?.partners);
  return result?.data?.[0] || null;
}
export async function getDonatePage() { 
  
  const result = await callAPI(`/donate/getPage`);

  if (result?.status !== "success") {
    throw new Error(
      result?.message || "Failed to fetch page data"
    );
  }

  console.log("DONATE PAGE >>>", result?.data[0]);
  return result?.data?.[0] || null;
}

export async function getLearningPage() { 
  
  const result = await callAPI(`/learningpage/pageList/learningPage`);
  if (result?.status !== "success") {
    throw new Error(result?.message || "Failed to fetch page data");
  }
  console.log("API RESULT >>>", result);
  return result?.data || null;
}

export async function getAllProgram() { 
  
  const result = await callAPI(`/program/getList`);
  if (result?.status !== "success") {
    throw new Error(result?.message || "Failed to fetch page data");
  }
  console.log("API RESULT >>>", result);
  return result?.data || null;
}

export async function getProgramPage(programId) { 
  
  const result = await callAPI(`/program/detail/${programId}`);
  if (result?.status !== "success") {
    throw new Error(result?.message || "Failed to fetch page data");
  }
  console.log("API RESULT >>>", result);
  return result?.data || null;
}

export async function getGalleries() { 
  
  const result = await callAPI(`/gallery/getList`);
  if (result?.status !== "success") {
    throw new Error(result?.message || "Failed to fetch page data");
  }
  console.log("Gallery API RESULT >>>", result);
  return result?.data || null;
}
export async function getNews() { 
  
  const result = await callAPI(`/learningpage/pageList/news`);
  if (result?.status !== "success") {
    throw new Error(result?.message || "Failed to fetch page data");
  }
  console.log("News API RESULT >>>", result);
  return result?.data || null;
}