import axios from "axios";
import { getApiConfig } from "./config.js";
// import getHeaders from "./index.js"

const getHeaders = async (requestHeaders) => {
  const headers = {};
  const token = localStorage.getItem("authToken");
  requestHeaders.forEach((header) => {
    switch (header) {
      case "access-token":
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("Access token not found in localStorage.");
        }
        break;
      case "typeApplication":
        headers["Content-Type"] = "application/json";
        break;
      default:
        console.warn(`Unrecognized header type: ${header}`);
        break;
    }
  });
  return headers;
};

export async function getAPI(apiName, params = {}, setData) {
  const BASE_URL = "https://school-application-three.vercel.app/api";
  try {
    const config = {
      method: getApiConfig[apiName].method,
      headers: await getHeaders(["access-token"]),
      url: BASE_URL + getApiConfig[apiName].url,
      params: params,
    };
    const response = await axios(config);
    // console.log("API call successful:", response.data);
    await setData(response.data.data);
    return response?.data;
  } catch (error) {
    console.error(
      "API call failed:",
      error.response.data,
      error.response.status
    );
    setData(error.response.data.message);

    return error;
  }
}

// ../utility/api/apiCall.js
export const deleteAPI = async (endpoint) => {
  try {
    const config = {
        method: "DELETE",
        headers: await getHeaders(["access-token"]),
        url: `https://school-application-three.vercel.app/api/${endpoint}`,
      };
    const response = await axios(config);
    console.log("API call successful:", response);
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    return error;
  }
};

// export async function postAPI(apiName, data = {}, setData, schoolId) {
//     const BASE_URL = "https://school-application-three.vercel.app/api";
//     try {
//         console.log("API Name:", apiName); // Debugging line
//         const config = {
//             method: getApiConfig[apiName]?.method, // Use optional chaining to avoid accessing undefined
//             headers: await getHeaders(["access-token", "typeApplication"]),
//             url: BASE_URL + getApiConfig[apiName]?.url.replace(':schoolId', schoolId), // Replace placeholder with schoolId
//             data: data
//         };

//         // Check if config is defined
//         if (!config.method || !config.url) {
//             throw new Error("Invalid API configuration");
//         }

//         const response = await axios(config);
//         console.log("API response:", response);
//         setData(response.data.data);
//         return response.data;
//     } catch (error) {
//         console.error("API call failed:", error.response ? error.response.data : error.message);
//         setData(error.response ? error.response.data.message : 'An error occurred');
//         return error;
//     }
// }
