import Cookies from "js-cookie";

export const getHeaders = async (requestHeaders) => {
  // Retrieve the token from cookies
  const token = Cookies.get("accessToken"); // No need for await here
  console.log("Access token:", token); // Debugging log to verify token
  // Initialize headers object
  const headers = {};

  Cookies.set("accessToken2", "example-token", { expires: 7, path: "/" , sameSite: "None", secure: true}); // Set cookie

  // Get cookie
  const token2 = Cookies.get("accessToken2");
  console.log("Access token2:", token2);

  // Loop through requestHeaders array
  requestHeaders?.forEach((header) => {
    switch (header) {
      case "access-token":
        if (token) {
          headers["Authorization"] = `Bearer ${token}`; // Use token from cookies
        } else {
          console.warn("Access token not found in cookies.");
        }
        break;
      case "typeApplication":
        headers["Content-Type"] = "application/json";
        break;
      default:
        console.warn(`Unrecognized header type: ${header}`); // Added logging for unexpected headers
        break;
    }
  });

  console.log("Constructed headers:", headers); // Debugging log to verify headers

  return headers;
};
