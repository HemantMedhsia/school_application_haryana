import axios from 'axios';
import Cookies from 'js-cookie';
import { getHeaders } from '.';
import { getApiConfig } from './config';

// Fetch Get API function
export const fetchGetAPI = async (apiName, params = {}, setData) => {
    try {
        // Validate and retrieve headers
        const requestHeaders = ["access-token"];
        const headers = getHeaders(requestHeaders);

        console.log('Request Headers:', headers); // Debugging: Log headers

        // Ensure params is an object
        if (typeof params !== 'object' || params === null) {
            params = {};
        }

        // Ensure apiName is a string
        if (typeof apiName !== 'string') {
            throw new TypeError('apiName must be a string');
        }

        // Construct the URL
        const baseUrl = 'https://school-application-three.vercel.app/api';
        const apiConfig = getApiConfig[apiName];
        if (!apiConfig || !apiConfig.url) {
            throw new Error(`Invalid API configuration for apiName: ${apiName}`);
        }
        const url = `${baseUrl}${apiConfig.url}`;
        console.log('Request URL:', url); // Debugging: Log the URL

        // Axios configuration
        const config = {
            method: 'get',
            url: url,
            headers: headers,
            params: params,
            withCredentials: true, // Required to include cookies in requests
        };

        // Make the API request
        const response = await axios(config);
        console.log('API response:', response);

        // Set data if provided
        if (setData) {
            setData(response.data);
        }
    } catch (error) {
        console.error('Error making API call:', error.response ? error.response.data : error.message);
    }
};
