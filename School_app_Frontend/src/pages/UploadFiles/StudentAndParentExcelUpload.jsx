import React, { useState } from 'react';

const StudentAndParentExcelUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    // Step 1: Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Step 2: Send FormData to API
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-bulk-students`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to upload file: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during upload.");
    }
  };

  return (
    <div>
      <h2>Upload Student and Parent Data (Excel File)</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default StudentAndParentExcelUpload;
