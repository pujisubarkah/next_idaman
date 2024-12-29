'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/data/jfu");
      setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching statuses:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPegawai = (pegawai) => {
    setModalData(pegawai);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData([]);
  };

  return (
    <div className="flex-4 h-full px-4 overflow-auto">
      <div className="text-center mb-10">
        <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER JABATAN FUNGSIONAL TERTENTU</h3>
      </div>
    
      <div className="text-right mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Jabatan Fungsional Tertentu
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Nama Jabatan</th>
            
                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Jumlah Pegawai</th>
                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map(({ jf_nama, jf_skill, total_pegawai, pegawai }, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="px-4 py-2 border border-teal-300">{jf_nama}</td>
               
                  <td
                    className="px-4 py-2 border border-teal-300 cursor-pointer text-teal-700 hover:underline"
                    onClick={() => handleShowPegawai(pegawai)}
                  >
                    {total_pegawai}
                  </td>
                  <td className="px-4 py-2 border border-teal-300">
                    <div className="flex gap-x-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%]">
      <h2 className="text-lg font-bold mb-4">Detail Pegawai</h2>
      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300 text-left">NIP</th>
              <th className="p-2 border border-gray-300 text-left">Nama</th>
              <th className="p-2 border border-gray-300 text-left">Satuan Kerja</th>
              <th className="p-2 border border-gray-300 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {modalData.map(({ peg_nip, peg_nama, satuan_kerja_nama }, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2 border border-gray-300">{peg_nip}</td>
                <td className="p-2 border border-gray-300">{peg_nama}</td>
                <td className="p-2 border border-gray-300">{satuan_kerja_nama}</td>
                <td className="p-2 border border-gray-300">
                  <div className="flex gap-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                      onClick={() => window.open(`/pegawai/profile/edit/${peg_nip}`, "_blank")}
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"
                      onClick={() => window.open(`/edit-pegawai/${peg_nip}`, "_blank")}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={closeModal}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
