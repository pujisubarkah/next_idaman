'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'; // Use Next.js Link
import RootLayout from '../../pegawai/profile/edit/layout';

const JFTpage = () => {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ jf_nama: '', jf_skill: '', total_pegawai: 0 });

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/data/jft");
      setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching statuses:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPegawai = (pegawai: any) => {
    setModalData(pegawai);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData([]);
  };

  const openFormModal = () => {
    setFormData({ jf_nama: '', jf_skill: '', total_pegawai: 0 });
    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
  };

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
      if (formData.jf_nama && formData.jf_skill) {
        await axios.post("/api/data/jft", formData);
        closeFormModal();
        fetchStatuses();
      } else {
        alert("Please fill in all fields.");
      }
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (jf_nama: string) => {
    if (window.confirm(`Are you sure you want to delete ${jf_nama}?`)) {
      try {
        await axios.delete(`/api/data/jft/${jf_nama}`);
        fetchStatuses();
      } catch (error) {
        console.error("Error deleting jabatan fungsional:", error.response?.data || error.message);
      }
    }
  };

  return (
    <RootLayout>
      <div className="flex-4 h-full px-4 overflow-auto">
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER JABATAN FUNGSIONAL TERTENTU</h3>
        </div>

        <div className="text-right mb-4">
          <Link href="/data/JFT/tambah">
            <button className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c] flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Tambah Jabatan Fungsional Tertentu
            </button>
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
              <thead>
                <tr className="bg-[#3781c7] text-white">
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama Jabatan</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Skill</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah Pegawai</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map(({ jf_id, jf_nama, jf_skill, total_pegawai, pegawai }, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                    <td className="px-4 py-2 border border-[#f2bd1d]">{jf_nama}</td>
                    <td className="px-4 py-2 border border-[#f2bd1d]">{jf_skill}</td>
                    <td
                      className="px-4 py-2 border border-[#f2bd1d] cursor-pointer text-[#3781c7] hover:underline"
                      onClick={() => handleShowPegawai(pegawai)}
                    >
                      {total_pegawai}
                    </td>
                    <td className="px-4 py-2 border border-[#f2bd1d]">
                      <div className="flex gap-x-2">
                        <Link href={`/data/JFT/edit/${jf_id}`}>
                          <button className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a5a8c] flex items-center">
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                          onClick={() => handleDelete(jf_nama)}
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
                              className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a5a8c] flex items-center"
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
    </RootLayout>
  );
};

export default JFTpage;