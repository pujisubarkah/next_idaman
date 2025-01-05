"use client";

import React, { useState } from "react";
import UpdateJabatanModal from "./UpdateJabatanModal"; // Adjust the path as necessary

const JabatanForm: React.FC = () => {
  const [jabatanData, setJabatanData] = useState({
    jenisJabatan: '',
    namaJabatan: '',
  });

  const [pegawai, setPegawai] = useState({
    peg_cpns_tmt: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPegawai((prev) => ({ ...prev, [name]: value }));
  };

  const handleJabatanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJabatanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateJabatan = (data: any) => {
    // Handle the update logic here
    console.log("Updated Jabatan Data:", data);
    console.log("Updated Pegawai Data:", pegawai);
  };

  return (
    <div className="w-full">
      {/* TMT Jabatan */}
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Jenis Jabatan:</label>
        <input
          id="peg_cpns_tmt"
          name="peg_cpns_tmt"
          type="text"
          value={pegawai.peg_cpns_tmt || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>

      {/* Nama Jabatan */}
      <div className="mb-4 flex items-center">
        <label  className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Nama Jabatan:</label>
        <input
          name="namaJabatan"
          type="text"
          value={jabatanData.namaJabatan}
          onChange={handleJabatanChange}
          className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
        <button
          type="button"
          className="bg-teal-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setIsModalOpen(true)} // Open the modal
        >
          Update Jabatan
        </button>
      </div>

      {/* Update Jabatan Modal */}
      <UpdateJabatanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateJabatan}
      />
    </div>
  );
};

export default JabatanForm;
