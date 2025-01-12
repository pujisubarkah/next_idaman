import React, { useState } from "react";
import Select from "react-select"; // Import react-select
import UpdateGolonganModal from "./UpdateGolonganModal";

interface GolonganFormProps {
    pegawai: {
        gol_id_akhir: string | null; // Adjust this type as necessary
        gol_id_awal: string | null; // Add gol_id_awal to the pegawai object
        peg_gol_awal_tmt?: string; // Add other properties as needed
        peg_gol_akhir_tmt?: string; // Add other properties as needed
        masa_kerja_golongan?: string; // Add masa_kerja_golongan to the pegawai object
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setPegawai: (data: any) => void; // Adjust this type as necessary
    golonganOptions: { value: string; label: string }[]; // Add golonganOptions prop
    golonganData: { gol_id: string; nm_gol: string }[]; // Add golonganData prop
}

const GolonganForm: React.FC<GolonganFormProps> = ({
    pegawai,
    handleChange,
    setPegawai,
    golonganOptions,
    golonganData,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    const openModal = () => setIsModalOpen(true); // Function to open the modal
    const closeModal = () => setIsModalOpen(false); // Function to close the modal

    return (
        <>
            <div className="mb-4">
                {/* Golongan Awal Dropdown */}
                <div className="mb-4 flex items-center">
                    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">
                        Golongan Awal:
                    </label>
                    <Select
                        value={golonganOptions.find(option => option.value === pegawai.gol_id_awal) || null}
                        onChange={(selectedOption) => {
                            setPegawai((prev) => ({
                                ...prev,
                                gol_id_awal: selectedOption ? selectedOption.value : null,
                            }));
                        }}
                        options={golonganOptions}
                        className="w-2/6 mr-2"
                        placeholder="Pilih Golongan"
                    />
                    {pegawai && (
                        <div className="flex items-center ml-4 w-1/3">
                            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-[#87ceeb] p-2">
                                TMT Golongan Awal:
                            </label>
                            <input
                                id="peg_gol_awal_tmt"
                                name="peg_gol_awal_tmt"
                                type="date"
                                value={pegawai.peg_gol_awal_tmt || ""}
                                onChange={handleChange}
                                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Golongan Akhir Dropdown */}
                <div className="mb-4 flex items-center">
                    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">
                        Golongan Akhir:
                    </label>
                    <Select
                        value={golonganOptions.find(option => option.value === pegawai.gol_id_akhir) || null}
                        onChange={(selectedOption) => {
                            setPegawai((prev) => ({
                                ...prev,
                                gol_id_akhir: selectedOption ? selectedOption.value : null,
                            }));
                        }}
                        options={golonganOptions}
                        className="w-2/6 mr-2"
                        placeholder="Pilih Golongan Akhir"
                    />
                    {pegawai && (
                        <div className="flex items-center ml-4 w-1/3">
                            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-[#87ceeb] p-2">
                                TMT Golongan Akhir:
                            </label>
                            <input
                                id="peg_gol_akhir_tmt"
                                name="peg_gol_akhir_tmt"
                                type="date"
                                value={pegawai.peg_gol_akhir_tmt || ""}
                                onChange={handleChange}
                                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Masa Kerja Golongan and Update Button */}
                <div className="flex items-center mb-4">
                    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">
                        Masa Kerja Golongan:
                    </label>
                    <input
                        id="masa_kerja_golongan"
                        name="masa_kerja_golongan"
                        type="text"
                        value={pegawai.masa_kerja_golongan || ""}
                        onChange={handleChange}
                        className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        placeholder="Masukkan Masa Kerja"
                    />
                    <div className="flex items-center ml-4 w-1/3">
                        <button
                            type="button"
                            className="bg-[#3781c7] hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={openModal}
                        >
                            Update Golongan
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Component */}
            <UpdateGolonganModal isOpen={isModalOpen} onClose={closeModal} golonganData={golonganData} onSubmit={(formData) => { /* handle form submission */ }} />
        </>
    );
};

export default GolonganForm;
