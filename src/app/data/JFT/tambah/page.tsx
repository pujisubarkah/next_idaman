"use client";

// src/pages/data/jft/TambahJFT.js  
import React, { useState } from 'react';  
import axios from 'axios';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faSave } from '@fortawesome/free-solid-svg-icons';  
import RootLayout from '../../../pegawai/profile/edit/layout';

const TambahJFT = () => {  
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
      // Submit the form data to the server  
      await axios.post("/api/data/jft", formData);  
      // Optionally redirect or show a success message  
      alert("Data successfully submitted!");  
    } catch (error) {  
      console.error("Error submitting form:", error.response?.data || error.message);  
    }  
  };  

  return (  
    <RootLayout>
    <div className="p-6">  
      <h2 className="text-lg font-bold mb-4">Tambah Jabatan Fungsional Tertentu</h2>  
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
            <FontAwesomeIcon icon={faSave} className="mr-2" />  
            Simpan  
          </button>  
        </div>  
      </form>  
    </div> 
    </RootLayout> 
  );  
};  

export default TambahJFT;  