import React, { useState } from 'react';
import * as XLSX from 'xlsx';

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

    // Step 1: Read the Excel file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Step 2: Convert the workbook to CSV
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);

      // Step 3: Send CSV data to API
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-bulk-students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/csv',
          },
          body: csvData,
        });

        if (response.ok) {
          alert("File uploaded successfully!");
        } else {
          alert("Failed to upload file.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred during upload.");
      }
    };

    reader.readAsArrayBuffer(file);
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
