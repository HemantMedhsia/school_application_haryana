import Cookies from "js-cookie";

export const getHeaders = (requestHeaders) => {
    // Retrieve the token from cookies
    const token = Cookies.get("accessToken");

    // Initialize headers object
    const headers = {};

    // Loop through requestHeaders array
    requestHeaders?.forEach((header) => {
        switch (header) {
            case "access-token":
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`; // Use token from cookies
                } else {
                    console.warn('Access token not found in cookies.');
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

    console.log('Constructed headers:', headers); // Debugging log to verify headers

    return headers;
};
