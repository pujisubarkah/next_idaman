'use client';
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Select from "react-select";

const Riwayattimkerja = () => {
    interface DataTimKerja {
        timkerja_id?: string; // Use string if IDs are strings
        no: number;
        namakegiatan: string;
        peran: string;
        nomorsk: string;
        tahun: number;
        tingkat: string;
        penandatangan: string;
        peg_id?: string;
    }

    const [data, setData] = useState<DataTimKerja[]>([]);
    const [nip, setNip] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<DataTimKerja>({
        timkerja_id: undefined,
        no: 0,
        namakegiatan: "",
        peran: "",
        nomorsk: "",
        tahun: 0,
        tingkat: "Nasional",
        penandatangan: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Options for the peran dropdown
    const peranOptions = [
        { value: "Ketua", label: "Ketua" },
        { value: "Wakil Ketua", label: "Wakil Ketua" },
        { value: "Sekretaris", label: "Sekretaris" },
        { value: "Bendahara", label: "Bendahara" },
        { value: "Anggota", label: "Anggota" },
    ];

    // Fetch the work history data
    const fetchRiwayattimkerja = async (nip: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/kinerja/timkerja?peg_id=${nip}`);
            const mappedData = response.data.map((item: any, index: number) => ({
                timkerja_id: item.timkerja_id,
                no: index + 1,
                namakegiatan: item.timkerja_nama,
                peran: item.timkerja_peran,
                nomorsk: item.timkerja_nomor,
                tahun: item.tahun,
                tingkat: item.timkerja_tingkat,
                penandatangan: item.timkerja_penandatangan,
            }));
            setData(mappedData);
            setError(null);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    // Extract NIP from the URL
    useEffect(() => {
        const path = window.location.pathname;
        const segments = path.split("/");
        const nipFromUrl = segments[segments.length - 1];
        setNip(nipFromUrl);
    }, []);

    // Fetch data whenever NIP changes
    useEffect(() => {
        if (nip) {
            fetchRiwayattimkerja(nip);
        }
    }, [nip]);

    // Handle editing data
    const handleEdit = (item: DataTimKerja) => {
        setFormData(item);
        setIsModalOpen(true);
    };

    // Handle deleting data
    const handleDelete = async (id?: string) => {
        if (!id) {
            console.error("No ID provided for deletion");
            return; // Exit if no ID is provided
        }

        setLoading(true);
        try {
            await axios.delete(`/api/kinerja/timkerja/${id}`);
            fetchRiwayattimkerja(nip!); // Refresh the list after deleting
            setError(null);
        } catch (error) {
            console.error("Error deleting data:", error);
            setError("Failed to delete data");
        } finally {
            setLoading(false);
        }
    };

    // Handle adding or updating data
    const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newForm = { ...formData, peg_id: nip }; // Ensure peg_id is set
            newForm.tahun = Number(newForm.tahun); // Ensure tahun is a number

            if (formData.timkerja_id) {
                // Update existing record
                await axios.put(`/api/kinerja/timkerja/${formData.timkerja_id}`, newForm);
            } else {
                // Add new record
                await axios.post("/api/kinerja/timkerja", newForm);
            }

            // Reset form and close modal
            resetForm();
            fetchRiwayattimkerja(nip!); // Refresh the list after adding or updating
            setError(null);
        } catch (error) {
            console.error("Error adding or updating data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            timkerja_id: undefined,
            no: 0,
            namakegiatan: "",
            peran: "",
            nomorsk: "",
            tahun: 0,
            tingkat: "Nasional",
            penandatangan: "",
        });
        setIsModalOpen(false);
    };

    return (
        <div id="timkerja" className="p-8">
            <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">
                Riwayat Tim Kerja
            </h3>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex justify-end mb-4">
                <button
                    className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
                    onClick={() => {
                        resetForm(); // Reset form for new entry
                        setIsModalOpen(true);
                    }}
                    disabled={loading}
                >
                    <FontAwesomeIcon icon={faPlus} /> Tambah
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-3/4 md:w-1/2 p-6 rounded shadow-lg">
                        <h4 className="text-lg font-semibold mb-4">
                            {formData.timkerja_id ? "Edit Data" : "Tambah Data"}
                        </h4>
                        <form onSubmit={handleAddOrUpdate}>
                            <div className="space-y-4">
                                {/* Updated order of fields */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-semibold">Nama Kegiatan</label>
                                    <input
                                        className="block w-full p-2 border"
                                        placeholder="Nama Kegiatan"
                                        value={formData.namakegiatan}
                                        onChange={(e) => setFormData({ ...formData, namakegiatan: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-semibold">Keterlibatan Tim Kerja</label>
                                    <Select
                                        options={peranOptions}
                                        value={peranOptions.find(option => option.value === formData.peran)}
                                        onChange={(selectedOption) => setFormData({ ...formData, peran: selectedOption?.value || "" })}
                                        placeholder="Pilih Peran"
                                        isClearable
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-semibold">Nomor SK</label>
                                    <input
                                        className="block w-full p-2 border"
                                        placeholder="Nomor SK"
                                        value={formData.nomorsk}
                                        onChange={(e) => setFormData({ ...formData, nomorsk: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-semibold">Tahun</label>
                                    <input
                                        type="number"
                                        className="block w-full p-2 border"
                                        placeholder="Tahun"
                                        value={formData.tahun}
                                        onChange={(e) => setFormData({ ...formData, tahun: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-semibold">Keterlibatan pada Tingkat</label>
                                    <div className="flex space-x-4">
                                        {["Instansi", "Nasional", "Internasional"].map((level) => (
                                            <label key={level} className="flex items-center">
                                                < input
                                                    type="radio"
                                                    name="tingkat"
                                                    value={level}
                                                    checked={formData.tingkat === level}
                                                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                                                    className="mr-2"
                                                />
                                                {level}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-semibold">Penandatangan</label>
                                    <input
                                        className="block w-full p-2 border"
                                        placeholder="Penandatangan"
                                        value={formData.penandatangan}
                                        onChange={(e) => setFormData({ ...formData, penandatangan: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Simpan"}
                                    </button>
                                    <button
                                         className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mr-2"
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
                <thead className="bg-[#3781c7] text-white">
                    <tr className="text-sm uppercase">
                        <th className="p-3 border border-[#f2bd1d]">No</th>
                        <th className="p-3 border border-[#f2bd1d]">Nama Kegiatan</th>
                        <th className="p-3 border border-[#f2bd1d]">Peran</th>
                        <th className="p-3 border border-[#f2bd1d]">Nomor SK</th>
                        <th className="p-3 border border-[#f2bd1d]">Tahun</th>
                        <th className="p-3 border border-[#f2bd1d]">Tingkat</th>
                        <th className="p-3 border border-[#f2bd1d]">Penandatangan</th>
                        <th className="p-3 border border-[#f2bd1d]">Pilihan</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="text-center p-4">
                                Loading...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center p-4">
                                Tidak ada data.
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.timkerja_id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>
                                <td className="p-3 border border-[#f2bd1d]">{item.namakegiatan}</td>
                                <td className="p-3 border border-[#f2bd1d]">{item.peran}</td>
                                <td className="p-3 border border-[#f2bd1d]">{item.nomorsk}</td>
                                <td className="p-3 border border-[#f2bd1d]">{item.tahun}</td>
                                <td className="p-3 border border-[#f2bd1d]">{item.tingkat}</td>
                                <td className="p-3 border border-[#f2bd1d]">{item.penandatangan}</td>
                                <td className="p-3 border border-[#f2bd1d]">
                                    <div className="flex space-x-4">
                                        <button onClick={() => handleEdit(item)} className="text-green-500 hover:text-green-700" aria-label="Edit" disabled={loading}>
                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.timkerja_id)} className="text-red-500 hover:text-red-700" aria-label="Delete" disabled={loading}>
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </div>
 </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Riwayattimkerja;