import Cookies from "js-cookie";
export const getHeaders = (requestHeaders) => {
    const token = Cookies.get("accessToken");
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDU5Yzc4MWM3MTY1NmY5Y2U2ODdjMiIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzI1Mjc5NDMyLCJleHAiOjE3MjUyODAzMzJ9.qX-i1S11vnDHv88XAERG6-ctngvqNrct98ogKybmuiQ"
    const headers = {};
    requestHeaders?.forEach((header) => {
        switch (header) {
            case "access-token":    
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`; // Corrected to use token from Cookies
                }
                break;
            case "typeApplication":
                headers["Content-Type"] = "application/json";
                break;
            default:
                headers[header] = requestHeaders[header];
                break;
        }
    });
    return headers;
};