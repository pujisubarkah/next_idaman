import React, { useState } from 'react';
import { FaPencilAlt, FaExclamationTriangle, FaPaperPlane, FaDownload } from 'react-icons/fa';

const ProfileEditButtons: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSetPensiunModalOpen, setIsSetPensiunModalOpen] = useState(false);
    const [isSetMeninggalModalOpen, setIsSetMeninggalModalOpen] = useState(false);
    const [isSetPindahModalOpen, setIsSetPindahModalOpen] = useState(false);
    const [isSetCutiModalOpen, setIsSetCutiModalOpen] = useState(false);
    const [isSetBerhentiModalOpen, setIsSetBerhentiModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen((prev) => !prev);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleSetPensiunModal = () => setIsSetPensiunModalOpen((prev) => !prev);
    const toggleSetMeninggalModal = () => setIsSetMeninggalModalOpen((prev) => !prev);
    const toggleSetPindahModal = () => setIsSetPindahModalOpen((prev) => !prev);
    const toggleSetCutiModal = () => setIsSetCutiModalOpen((prev) => !prev);
    const toggleSetBerhentiModal = () => setIsSetBerhentiModalOpen((prev) => !prev);


    const dropdownOptions = [
        { label: 'Set Pensiun', action: toggleSetPensiunModal },
        { label: 'Set Meninggal Dunia', action: toggleSetMeninggalModal },
        { label: 'Set Pindah ke Luar LAN', action: toggleSetPindahModal },
        { label: 'Set CTLN', action: toggleSetCutiModal },
        { label: 'Set Diberhentikan', action: toggleSetBerhentiModal },
    ];

    return (
        <div id="profile-container" className="w-full p-2 rounded-md bg-transparent">
            {/* Buttons */}
            <div className="flex justify-end mb-4 pr-4 space-x-2">
                <button className="flex items-center bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700">
                    <FaPencilAlt className="mr-2" /> Edit
                </button>
                <button
                    className="flex items-center bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={toggleModal}
                >
                    <FaExclamationTriangle className="mr-2" /> Update Kedudukan Pegawai
                </button>
                <div className="relative">
                    <button
                        className="flex items-center bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={toggleDropdown}
                    >
                        <FaExclamationTriangle className="mr-2" /> Update Status Kepegawaian
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg w-48 z-10">
                            <ul>
                                {dropdownOptions.map((option, index) => (
                                    <li key={index}>
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                            onClick={() => {
                                                option.action();
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <button
                            className="flex items-center bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                            onClick={() => {
                                const isConfirmed = window.confirm ("Apakah Anda yakin?");
                                if (isConfirmed) {
                                    alert("Data telah disubmit!"); // Replace this with your actual submission logic
                                }
                            }}
                        >
                            <FaPaperPlane className="mr-2" /> Submit
                        </button>
                <button className="flex items-center bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700">
                    <FaDownload className="mr-2" /> Download Data Pegawai
                </button>
            </div>

            {/* Modal for Kedudukan Pegawai */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Update Kedudukan Pegawai</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="kedudukan" className="block text-sm font-medium text-gray-700">
                                    Kedudukan Pegawai
                                </label>
                                <input
                                    type="text"
                                    id="kedudukan"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="nomorSk" className="block text-sm font-medium text-gray-700">
                                    Nomor SK
                                </label>
                                <input
                                    type="text"
                                    id="nomorSk"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tanggalSk" className="block text-sm font-medium text-gray-700">
                                    Tanggal SK
                                </label>
                                <input
                                    type="date"
                                    id="tanggalSk"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tmt" className="block text-sm font-medium text-gray-700">
                                    TMT Kedudukan
                                </label>
                                <input
                                    type="date"
                                    id="tmt"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={toggleModal}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Set Pensiun */}
            {isSetPensiunModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Cek Status Update Pegawai</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="noSkPensiun" className="block text-sm font-medium text-gray-700">
                                    No SK Pensiun
                                </label>
                                <input
                                    type="text"
                                    id="noSkPensiun"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tmtSkPensiun" className="block text-sm font-medium text-gray-700">
                                    TMT SK Pensiun
                                </label>
                                <input
                                    type="date"
                                    id="tmtSkPensiun"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={toggleSetPensiunModal}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Set Meninggal */}
            {isSetMeninggalModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Cek Update Status Kepegawaian</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="noSkMeninggal" className="block text-sm font-medium text-gray-700">
                                    No SK Meninggal
                                </label>
                                <input
                                    type="text"
                                    id="noSkMeninggal"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tmtSkMeninggal" className="block text-sm font-medium text-gray-700">
                                    TMT SK Meninggal
                                </label>
                                <input
                                    type="date"
                                    id="tmtSkMeninggal"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="penyebabKematian" className="block text-sm font-medium text-gray-700">
                                    Penyebab Kematian
                                </label>
                                <input
                                    type="text"
                                    id="penyebabKematian"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="suratKeterangan" className="block text-sm font-medium text-gray-700">
                                    Upload Surat Keterangan
                                </label>
                                <input
                                    type="file"
                                    id="suratKeterangan"
                                    accept=".pdf, .doc, .docx, .jpg, .png"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={toggleSetMeninggalModal}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Modal for Set Pindah */}
            {isSetPindahModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Cek Update Status Kepegawaian</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="noSkPindah" className="block text-sm font-medium text-gray-700">
                                    No SK Pindah
                                </label>
                                <input
                                    type="text"
                                    id="noSkPindah"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tmtSkPindah" className="block text-sm font-medium text-gray-700">
                                    TMT Pindah
                                </label>
                                <input
                                    type="date"
                                    id="tmtSkPindah"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="pindah" className="block text-sm font-medium text-gray-700">
                                    Pindah Ke
                                </label>
                                <input
                                    type="text"
                                    id="pindah"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>


                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={toggleSetPindahModal}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Set Cuti */} 
            {isSetCutiModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Cek Update Status Kepegawaian</h2>
                        <form>
                        <div className="mb-4">
                                <label htmlFor="noSkCuti" className="block text-sm font-medium text-gray-700">
                                    Jenis Cuti
                                </label>
                                <input
                                    type="text"
                                    id="noSkCuti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="noSkCuti" className="block text-sm font-medium text-gray-700">
                                    No SK Cuti
                                </label>
                                <input
                                    type="text"
                                    id="noSkCuti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="CutiMulai" className="block text-sm font-medium text-gray-700">
                                    Tanggal Cuti Mulai
                                </label>
                                <input
                                    type="date"
                                    id="tmtSkCuti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="CutiSelesai" className="block text-sm font-medium text-gray-700">
                                    Tanggal Cuti Selesai
                                </label>
                                <input
                                    type="date"
                                    id="tmtSkCuti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={toggleSetCutiModal}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Set Berhenti */}
            {isSetBerhentiModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Cek Update Status Kepegawaian</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="noSkBerhenti" className="block text-sm font-medium text-gray-700">
                                    No SK Berhenti
                                </label>
                                <input
                                    type="text"
                                    id="noSkBerhenti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tmtSkBerhenti" className="block text-sm font-medium text-gray-700">
                                    TMT SK Berhenti
                                </label>
                                <input
                                    type="date"
                                    id="tmtSkBerhenti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="noSkBerhenti" className="block text-sm font-medium text-gray-700">
                                    No SK Berhenti
                                </label>
                                <input
                                    type="text"
                                    id="noSkBerhenti"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={toggleSetBerhentiModal}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    );
};

export default ProfileEditButtons;
