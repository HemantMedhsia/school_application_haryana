// Testing.js
import React, { useState, useEffect } from 'react';
import { fetchGetAPI } from '../utility/api/apiCall';

const Testing = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchGetAPI("getAllTeachers", {}, setData); // Corrected parameters
    }, []);

    return (
        <div>
            <h1>Testing</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display data */}
        </div>
    );
};

export default Testing;
