import axios from 'axios';
import Cookies from 'js-cookie';
import { getHeaders } from '.';
import { getApiConfig } from './config';

// Fetch Get API function
export const fetchGetAPI = async (apiName, params = {}, setData) => {
    const requestHeaders = ["access-token"];
    const headers = getHeaders(requestHeaders);

    // Ensure params is an object
    if (typeof params !== 'object' || params === null) {
        params = {};
    }

    // Ensure apiName is a string
    if (typeof apiName !== 'string') {
        throw new TypeError('apiName must be a string');
    }

    // Correct URL construction
    const baseUrl = 'https://school-application-three.vercel.app/api';
    const url = `${baseUrl}${getApiConfig[apiName].url}`;

    const config = {
        method: 'get',
        url: url,
        headers: headers,
        params: params,
    };

    try {
        const response = await axios(config);
        console.log('API response:', response);

        if (setData) {
            setData(response.data);
        }
    } catch (error) {
        console.error('Error making API call:', error.response ? error.response.data : error.message);
    }
};