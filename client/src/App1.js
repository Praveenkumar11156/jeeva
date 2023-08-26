import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App1() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [schools, setSchools] = useState([]);
  const [schoolData, setSchoolData] = useState({
    School: '',
    Board: '',
    Percentage: '',
    Year: '',
    Location: '',
  });
  const [colleges, setColleges] = useState([]);
  const [collegeData, setCollegeData] = useState({
    College: '',
    Department: '',
    Percentage: '',
    Year: '',
    Location: '',
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/files');
      setFileList(response.data);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File uploaded successfully');
        fetchFileList(); // Refresh the file list
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddPerson = async () => {
    try {
      const response = await axios.post('http://localhost:3001/addPerson', {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        MobileNo: mobileNo,
        PermanentAddress: address,
      });

      if (response.status === 200) {
        console.log('Person added successfully');
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobileNo('');
        setAddress('');
      } else {
        console.error('Failed to add person');
      }
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const handleAddSchool = async () => {
    try {
      const response = await axios.post('http://localhost:3001/addSchool', schoolData)

      if (response.status === 200) {
        console.log('School Details added Successfully');
        setSchoolData({
          School : '',
          Board : '',
          Percentage : '',
          Year : '',
          Location : '',
        });
        // fetchSchools();
      } else {
        console.log('Failed to add School Details');
      }
    } catch (error) {
      console.log('Error Adding School Details:', error);
    }
  };

  const handleAddCollege = async () => {
    try {
      const response = await axios.post('http://localhost:3001/addCollege', collegeData);

      if (response.status === 200) {
        console.log('College added successfully');
        setCollegeData({
          College: '',
          Department: '',
          Percentage: '',
          Year: '',
          Location: '',
        });
        // fetchColleges(); 
      } else {
        console.error('Failed to add college');
      }
    } catch (error) {
      console.error('Error adding college:', error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await axios.delete(`http://localhost:3001/delete/${filename}`);
  
      if (response.status === 200) {
        console.log('File deleted successfully');
        fetchFileList(); // Refresh the file list
      } else {
        console.error('File deletion failed');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async ()  => {
    await handleAddPerson();
    await handleAddSchool();
    await handleAddCollege();
     fetchFileList();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCollegeInputChange = (e) => {
    const { name, value } = e.target;
    setCollegeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {currentStep === 1 && (
        <div>
          <h2>Person Details:</h2>
          <div>
            <label>First Name:</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label>Email:</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Mobile No:</label>
            <input type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
          </div>
          <div>
            <label>Permanent Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Education Details:</h2>
          <div>
        <label>School Name:</label>
        <input type="text" name="School" value={schoolData.School} onChange={handleInputChange} />
      </div>
      <div>
        <label>Board:</label>
        <input type="text" name="Board" value={schoolData.Board} onChange={handleInputChange} />
      </div>
      <div>
        <label>Percentage:</label>
        <input
          type="number"
          name="Percentage"
          value={schoolData.Percentage}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Passed Out Year:</label>
        <input type="number" name="Year" value={schoolData.Year} onChange={handleInputChange} />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="Location"
          value={schoolData.Location}
          onChange={handleInputChange}
        />
      </div> 
      
      <h2>College Details</h2>
      <div>
        <label>College Name:</label>
        <input type="text" name="College" value={collegeData.College} onChange={handleCollegeInputChange} />
      </div>
      <div>
        <label>Department:</label>
        <input type="text" name="Department" value={collegeData.Department} onChange={handleCollegeInputChange} />
      </div>
      <div>
        <label>Percentage:</label>
        <input
          type="number"
          name="Percentage"
          value={collegeData.Percentage}
          onChange={handleCollegeInputChange}
        />
      </div>
      <div>
        <label>Year:</label>
        <input type="number" name="Year" value={collegeData.Year} onChange={handleCollegeInputChange} />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="Location"
          value={collegeData.Location}
          onChange={handleCollegeInputChange}
        />
      </div>
      
      <br></br> <br></br>

          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload File</button>
          <div>
            <h2>Uploaded Resume:</h2>
            <ul>
              {fileList.map((file, index) => (
                <li key={index}>
                  {file.filename}{' '}
                  <a href={`http://localhost:3001/download/${file.filename}`} download>
                    Download
                  </a>{' '}
                  <button onClick={() => handleDelete(file.filename)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleBack}>Back</button> 
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default App1;
