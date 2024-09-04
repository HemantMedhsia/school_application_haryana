import Cookies from "js-cookie";

export const getHeaders = async (requestHeaders) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.warn("Access token not found in cookies.");
  } else {
    console.log("Access token:", token);
  }

  const headers = {};

  Cookies.set("accessToken2", "example-token", {
    expires: 7,
    path: "/",
    sameSite: "None",
    secure: true,
  });

  const token2 = Cookies.get("accessToken2");
  console.log("Access token2:", token2);

  // Loop through requestHeaders array
  requestHeaders?.forEach((header) => {
    switch (header) {
      case "access-token":
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("Access token not found in cookies.");
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

  console.log("Constructed headers:", headers);

  return headers;
};
