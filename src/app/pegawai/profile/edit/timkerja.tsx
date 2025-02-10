'use client';

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Riwayattimkerja = () => {
    interface TimKerja {
        timkerja_id: string;
        timkerja_nama: string;
        timkerja_nomor: string;
        tanggal_timkerja: string;
        timkerja_penandatangan: string;
        timkerja_peran: string;
        tahun: string;
        timkerja_tingkat: string;
    }

    const [dataTimKerja, setDataTimKerja] = useState<TimKerja[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTimKerja, setCurrentTimKerja] = useState<TimKerja>({
        timkerja_id: "",
        timkerja_nama: "",
        timkerja_nomor: "",
        tanggal_timkerja: "",
        timkerja_penandatangan: "",
        timkerja_peran: "",
        tahun: "",
        timkerja_tingkat: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pegId, setPegId] = useState<string | null>(null); // State to hold peg_id

    useEffect(() => {
        // Assuming you get peg_id from somewhere, e.g., props or context
        const path = window.location.pathname;
        const segments = path.split("/");
        const nipFromUrl = segments[segments.length - 1];
        setPegId(nipFromUrl); // Set peg_id from URL

        if (nipFromUrl) {
            fetchData(nipFromUrl); // Fetch data with peg_id
        }
    }, []);

    const fetchData = async (pegId: string) => {
        try {
            const response = await axios.get(`/api/kinerja/timkerja?peg_id=${pegId}`);
            setDataTimKerja(response.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data");
        }
    };

    const handleOpenModal = (timKerja: TimKerja | null = null) => {
        if (timKerja) {
            setIsEditing(true);
            setCurrentTimKerja(timKerja);
        } else {
            setIsEditing(false);
            setCurrentTimKerja({
                timkerja_id: "",
                timkerja_nama: "",
                timkerja_nomor: "",
                tanggal_timkerja: "",
                timkerja_penandatangan: "",
                timkerja_peran: "",
                tahun: "",
                timkerja_tingkat: ""
            });
        }
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setError("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentTimKerja({
            ...currentTimKerja,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        // Validasi sederhana
        if (!currentTimKerja.timkerja_nama || !currentTimKerja.timkerja_nomor || !currentTimKerja.tanggal_timkerja || !currentTimKerja.timkerja_penandatangan || !currentTimKerja.timkerja_peran || !currentTimKerja.tahun || !currentTimKerja.timkerja_tingkat) {
            setError("All fields are required");
            setLoading(false);
            return;
        }
    
        try {
            if (isEditing) {
                // Update data
                await axios.put(`/api/kinerja/timkerja/${currentTimKerja.timkerja_id}`, {
                    id: currentTimKerja.timkerja_id, // Include the ID in the body
                    timkerja_nama: currentTimKerja.timkerja_nama,
                    timkerja_nomor: currentTimKerja.timkerja_nomor,
                    tanggal_timkerja: currentTimKerja.tanggal_timkerja,
                    timkerja_penandatangan: currentTimKerja.timkerja_penandatangan,
                    timkerja_peran: currentTimKerja.timkerja_peran,
                    tahun: currentTimKerja.tahun,
                    timkerja_tingkat: currentTimKerja.timkerja_tingkat
                });
            } else {
                // Tambah data baru
                await axios.post('/api/kinerja/timkerja', { ...currentTimKerja, peg_id: pegId });
            }
            fetchData(pegId!); // Fetch data again after submit
            handleCloseModal();
        } catch (err) {
            console.error("Error submitting data:", err);
            if (err.response) {
                setError(err.response.data.message || "Failed to submit data");
            } else {
                setError("Failed to submit data");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (timkerja_id: string) => {
        if (!window.confirm("Apakah anda yakin data ini akan dihapus?")) return;
    
        try {
            console.log("Deleting ID:", timkerja_id); // Log the ID being deleted
            await axios.delete(`/api/kinerja/timkerja/${timkerja_id}`);
            fetchData(pegId!); // Fetch data again after delete
        } catch (err) {
            console.error("Error deleting data:", err);
            setError("Failed to delete data");
        }
    };

    return (
        <div className="p-8">
            <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">Riwayat Tim Kerja</h3>

            <div className="flex justify-end mb-4">
                <button onClick={() => handleOpenModal()} className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">
                    <FontAwesomeIcon icon={faPlus} /> Tambah
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
                <thead className="bg-[#3781c7] text-white">
                    <tr className="text-sm uppercase">
                        <th className="p-3 border border-[#f2bd1d]">No</th>
                        <th className="p-3 border border-[#f2bd1d]">Nama Kegiatan</th>
                        <th className="p-3 border border-[#f2bd1d]">Nomor</th>
                        <th className="p-3 border border-[#f2bd1d]">Tanggal</th>
                        <th className="p-3 border border-[#f2bd1d]">Penandatangan</th>
                        <th className="p-3 border border-[#f2bd1d]">Peran</th>
                        <th className="p-3 border border-[#f2bd1d]">Tahun</th>
                        <th className="p-3 border border-[#f2bd1d]">Tingkat</th>
                        <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
                    </tr>
                </thead>
                <tbody>
                    {dataTimKerja.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center p-4">Tidak ada data.</td>
                        </tr>
                    ) : (
                        dataTimKerja.map((timKerja, index) => (
                            <tr key={timKerja.timkerja_id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                                <td className="p-3 border border-[#f2bd1d]">{index + 1}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.timkerja_nama}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.timkerja_nomor}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.tanggal_timkerja}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.timkerja_penandatangan}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.timkerja_peran}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.tahun}</td>
                                <td className="p-3 border border-[#f2bd1d]">{timKerja.timkerja_tingkat}</td>
                                <td className="p-3 border border-[#f2bd1d]">
                                    <div className="flex space-x-4">
                                        <button onClick={() => handleOpenModal(timKerja)} className="text-green-500 hover:text-green-700" aria-label="Edit">
                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(timKerja.timkerja_id)} className="text-red-500 hover:text-red-700" aria-label="Delete">
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Modal for Adding/Editing Tim Kerja */}
            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">{isEditing ? "Edit Tim Kerja" : "Tambah Tim Kerja"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="timkerja_nama" className="block text-sm font-semibold w-1/3">Nama Kegiatan</label>
                                <input
                                    type="text"
                                    id="timkerja_nama"
                                    name="timkerja_nama"
                                    value={currentTimKerja.timkerja_nama}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="timkerja_nomor" className="block text-sm font-semibold w-1/3">Nomor</label>
                                <input
                                    type="text"
                                    id="timkerja_nomor"
                                    name="timkerja_nomor"
                                    value={currentTimKerja.timkerja_nomor}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="tanggal_timkerja" className="block text-sm font-semibold w-1/3">Tanggal</label>
                                <input
                                    type="date"
                                    id="tanggal_timkerja"
                                    name="tanggal_timkerja"
                                    value={currentTimKerja.tanggal_timkerja}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="timkerja_penandatangan" className="block text-sm font-semibold w-1/3">Penandatangan</label>
                                <input
                                    type="text"
                                    id="timkerja_penandatangan"
                                    name="timkerja_penandatangan"
                                    value={currentTimKerja.timkerja_penandatangan}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="timkerja_peran" className="block text-sm font-semibold w-1/3">Peran</label>
                                <input
                                    type="text"
                                    id="timkerja_peran"
                                    name="timkerja_peran"
                                    value={currentTimKerja.timkerja_peran}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="tahun" className="block text-sm font-semibold w-1/3">Tahun</label>
                                <input
                                    type="number"
                                    id="tahun"
                                    name="tahun"
                                    value={currentTimKerja.tahun}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <label htmlFor="timkerja_tingkat" className="block text-sm font-semibold w-1/3">Tingkat</label>
                                <input
                                    type="text"
                                    id="timkerja_tingkat"
                                    name="timkerja_tingkat"
                                    value={currentTimKerja.timkerja_tingkat}
                                    onChange={handleChange}
                                    className="w-2/3 px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                                    type="button"
                                    onClick={handleCloseModal}
                                >
                                    Batal
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                >
                                    {isEditing ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Riwayattimkerja;