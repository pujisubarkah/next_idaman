"use client";        
  
import React, { useEffect, useState } from 'react';        
import Link from 'next/link'; // Import Link from Next.js        
import axios from 'axios';        
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';        
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';        
  
const List: React.FC = () => {        
  const [profiles, setProfiles] = useState<any[]>([]);        
  const [currentPage, setCurrentPage] = useState(1);        
  const [searchQuery, setSearchQuery] = useState(''); // State for search query  
  const profilesPerPage = 15; // Number of profiles per page        
  
  useEffect(() => {        
    const fetchProfiles = async () => {        
      try {        
        const response = await axios.get('/api/pegawai/profile', {        
          headers: { "Cache-Control": "no-cache" },        
          params: { page: currentPage, limit: profilesPerPage }        
        });        
        setProfiles(response.data.data); // Assume data is in response.data.data        
      } catch (error) {        
        console.error("Error fetching profiles:", error);        
      }        
    };        
  
    fetchProfiles();        
  }, [currentPage]);        
  
  const handleNextPage = () => {        
    setCurrentPage((prevPage) => prevPage + 1);        
  };        
  
  const handlePreviousPage = () => {        
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));        
  };        
  
  // Filter profiles based on search query  
  const filteredProfiles = profiles.filter(profile =>   
    profile.peg_nama.toLowerCase().includes(searchQuery.toLowerCase())  
  );  
  
  return (        
    <div className="bg-[#3781c7] min-h-screen p-8"> {/* Changed background color here */}        
      <h1 className="text-white text-3xl mb-4">List Pegawai</h1>        
  
      {/* Search Input */}  
      <div className="mb-4">  
        <input   
          type="text"   
          placeholder="Cari nama pegawai..."   
          value={searchQuery}   
          onChange={(e) => setSearchQuery(e.target.value)}   
          className="w-full p-2 rounded-lg"   
        />  
      </div>  
  
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">        
        {filteredProfiles.map((profile) => (        
          <div key={profile.id} className="relative group">        
            <img        
              src={`https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${profile.peg_foto}`}        
              alt={profile.peg_nama}        
              className="w-full h-[300px] object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-110" // Add zoom effect on hover        
            />        
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">        
              <h2 className="text-lg font-semibold">{profile.peg_nama}</h2>        
              <Link href={`/pegawai/profile/edit/${profile.peg_nip}`} className="text-white underline">        
                {profile.peg_nip}        
              </Link>        
            </div>        
          </div>        
        ))}        
      </div>        
  
      <div className="flex justify-center mt-8">        
        <button        
          onClick={handlePreviousPage}        
          disabled={currentPage === 1}        
          className="bg-gray-700 text-white px-4 py-2 rounded-l-lg disabled:opacity-50 flex items-center"        
        >        
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left Arrow Icon */}        
          sebelumnya       
        </button>        
        <button        
          onClick={handleNextPage}        
          className="bg-gray-700 text-white px-4 py-2 rounded-r-lg flex items-center"        
        >        
          berikutnya       
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" /> {/* Right Arrow Icon */}        
        </button>        
      </div>        
    </div>        
  );        
};        
  
export default List;        
