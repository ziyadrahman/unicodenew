import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from '../api/api';
import { ClipLoader } from 'react-spinners'; // Importing the spinner

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadResult, setUploadResult] = useState(null); // To store detailed results
  const [isUploading, setIsUploading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null); // Reset previous results
    setMessage(''); // Reset previous messages
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    setMessage('');
    setUploadResult(null);

    try {
      const response = await axios.post(`${baseUrl.baseUrl}api/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(`Success: ${response.data.message}`);
      setUploadResult(response.data); // Store the detailed results
      console.log("Data added successfully");
    } catch (error) {
      console.error('Error uploading file:', error.response || error.message);
      const errorMessage = error.response?.data?.error || 'Error uploading file.';
      setMessage(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Function to download failed records as CSV
  const downloadFailedRecords = () => {
    if (!uploadResult || uploadResult.failedRecords.length === 0) return;

    const headers = [
      'Original Row',
      'Branch Name',
      'Category',
      'Sub-Category',
      'Half',
      'Year',
      'Item Code',
      'Size',
      'Error',
    ];

    const rows = uploadResult.failedRecords.map(record => [
      record.originalIndex,
      record.recordData.branchName,
      record.recordData.category,
      record.recordData.subCategory,
      record.recordData.half,
      record.recordData.year,
      record.recordData.itemCode,
      record.recordData.size,
      record.error,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'failed_records.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='container align-center'>
      <br />
      <h1>Upload CSV File</h1>
      <br /><br />
      <input
        type="file"
        onChange={handleFileChange}
        style={{ width: '30%' }}
        accept=".csv"
      /><br /><br />
      <button
        className='btn btn-success'
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? <ClipLoader size={20} color="#fff" /> : 'Upload'}
      </button>
      <p>{message}</p>

      {uploadResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Upload Summary:</h3>
          <p>Total Records: {uploadResult.totalRecords}</p>
          <p>Successfully Saved Groups: {uploadResult.savedRecordsCount}</p>
          <p>Failed Records: {uploadResult.failedRecordsCount}</p>

          {uploadResult.failedRecordsCount > 0 ? (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={downloadFailedRecords}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                Download Failed Records
              </button>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                  <tr>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Original Row</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Branch Name</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Category</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Sub-Category</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Half</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Year</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Item Code</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Size</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadResult.failedRecords.map((failed, idx) => (
                    <tr key={idx} style={{ backgroundColor: '#f8d7da' }}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.originalIndex}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.branchName || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.category || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.subCategory || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.half || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.year || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.itemCode || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.recordData.size || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{failed.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No failed records.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
