"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import axios from 'axios';

const List: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10; // Number of profiles per page

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

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-white text-3xl mb-8">List Pegawai</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="relative group">
            <img
              src={`https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${profile.peg_foto}`}
              alt={profile.peg_nama}
              className="w-full h-[200px] object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-110" // Add zoom effect on hover
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-2 rounded-b-lg">
              {profile.peg_nama} <br />
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
          className="bg-gray-700 text-white px-4 py-2 rounded-l-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="bg-gray-700 text-white px-4 py-2 rounded-r-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default List;