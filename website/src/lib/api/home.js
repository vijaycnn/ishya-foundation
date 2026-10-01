// import { completeSoftNavigation } from "next/dist/client/components/segment-cache/navigation";

const API_BASE_URL = process.env.API_BASE_URL;

export async function getHomePage() {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  const url = `${API_BASE_URL}/page/detail/home`;

  const response = await fetch(url, {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch home page: ${response.status}`
    );
  }

  const result = await response.json();
  // console.log('UI home >>>>', result?.data?.[0])

  if (result?.status !== "success") {
    throw new Error(
      result?.message || "Failed to fetch home page data"
    );
  }

  console.log("HOME API RESULT >>>", result);
  console.log("HOME PAGE LIST >>>", result?.data[0]);
  console.log("partners >>>", result?.data[0]?.partners);
  return result?.data?.[0] || null;
}