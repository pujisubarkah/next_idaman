"use client";

// src/pages/data/jft/EditJFT.js  
import React, { useState, useEffect } from 'react';  
import axios from 'axios';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faEdit } from '@fortawesome/free-solid-svg-icons';  
import RootLayout from '../../../../pegawai/profile/edit/layout';  
import { useParams } from 'react-router-dom'; // Import useParams to get the ID from the URL

const EditJFT = () => {  
  const { id } = useParams(); // Get the ID from the URL
  const [formData, setFormData] = useState({  
    nama_jabatan: '',  
    rumpun: '',  
    kategori: '',  
    golongan_awal: '',  
    golongan_akhir: '',  
    kode_jft: '',  
    batas_usia_pensiun: '',  
    skill: '',  
    jabatan_kelas: '',  
    kode_jabatan: ''  
  });  

  useEffect(() => {
    // Fetch the existing data for the given ID
    const fetchJFTData = async () => {
      try {
        const response = await axios.get(`/api/data/jft/${id}`); // Adjust the endpoint as necessary
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching JFT data:", error.response?.data || error.message);
      }
    };

    fetchJFTData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const { name, value } = e.target;  
    setFormData({  
      ...formData,  
      [name]: value  
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    try {  
      // Submit the updated form data to the server  
      await axios.put(`/api/data/jft/${id}`, formData); // Adjust the endpoint as necessary
      alert("Data successfully updated!");  
    } catch (error) {  
      console.error("Error submitting form:", error.response?.data || error.message);  
    }  
  };  

  return (  
    <RootLayout>
      <div className="p-6">  
        <h2 className="text-lg font-bold mb-4">Edit Jabatan Fungsional Tertentu</h2>  
        <form onSubmit={handleSubmit}>  
          {/* Form fields */}  
          {Object.keys(formData).map((key) => (  
            <div className="mb-4 flex items-center" key={key}>  
              <label className="block text-gray-700 text-sm font-bold mb-2 w-1/3" htmlFor={key}>  
                {key.replace(/_/g, ' ').toUpperCase()}  
              </label>  
              <input  
                className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
                id={key}  
                type="text"  
                name={key}  
                value={formData[key]}  
                onChange={handleInputChange}  
              />  
            </div>  
          ))}  
          <div className="flex justify-end">  
            <button  
              className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c]"  
              type="submit"  
            >  
              <FontAwesomeIcon icon={faEdit} className="mr-2" />  
              Update
            </button>  
          </div>  
        </form>  
      </div> 
    </RootLayout> 
  );  
};  

export default EditJFT;  