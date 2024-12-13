"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import Axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'; // Import useRouter

const ListUnit = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use Axios to fetch data from the API route
        const response = await axios.get('/api/unit_kerja'); // Ensure this endpoint exists and is correctly defined
        const data = response.data; // Axios automatically parses the JSON response

        // Check if the API returns an error
        if (response.status !== 200) {
          throw new Error(data.message || "Error fetching data from API");
        }

        // If the API returns data, process and filter it
        const filteredData = data
          .filter((unit) => unit.unit_kerja_id !== 99) // Exclude unit_kerja_id = 99
          .map((unit) => ({
            ...unit,
            jumlahPegawai: unit.spg_pegawai.length, // Add jumlah pegawai
            satuanKerjaNama: unit.m_spg_satuan_kerja?.satuan_kerja_nama || "Tidak Diketahui",
          }))
          .sort((a, b) => {
            // Sort by satuan_kerja_id, then unit_kerja_id
            if (a.satuan_kerja_id !== b.satuan_kerja_id) {
              return a.satuan_kerja_id - b.satuan_kerja_id;
            }
            return a.unit_kerja_id - b.unit_kerja_id;
          });

        setUnits(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // This will only run once when the component is mounted

  // Function to handle search click and navigate to another page
  const handleSearchClick = (unitKerjaId) => {
    // Use router.push to navigate to the ListAllPegawai page with unit_kerja_id as a URL parameter
    router.push(`/list-pegawai/all/${unitKerjaId}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Title of the Page */}
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4">List Unit Kerja</h2>
      </div>

      {/* Table for displaying List of Units */}
      <div className="mt-8">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">Satker</th>
                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">Unit Kerja</th>
                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">Jumlah Pegawai</th>
                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">Pilihan</th>
              </tr>
            </thead>
            <tbody>
              {units.map(({ unit_kerja_nama, jumlahPegawai, satuanKerjaNama, unit_kerja_id }, index) => (
                <tr
                  key={unit_kerja_id}
                  className={index % 2 === 0 ? "bg-teal-50" : "bg-white"} // Check if row is odd or even
                >
                  <td className="border border-gray-300 px-2 py-2">{satuanKerjaNama}</td>
                  <td className="border border-gray-300 px-4 py-2">{unit_kerja_nama}</td>
                  <td className="border border-gray-300 px-4 py-2">{jumlahPegawai}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-white-500 cursor-pointer mr-2"
                      onClick={() => handleSearchClick(unit_kerja_id)} // Call function to navigate to ListAllPegawai
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListUnit;
