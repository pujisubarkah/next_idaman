"use client";  
  
import React, { useState, useEffect } from 'react';  
import { useRouter } from 'next/navigation';  
import { FaPencilAlt, FaExclamationTriangle, FaPaperPlane, FaDownload } from 'react-icons/fa';  
  
interface ProfileEditButtonsProps {  
    nip: string;  
}  
  
const ProfileEditButtons: React.FC<ProfileEditButtonsProps> = ({ nip }) => {  
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  
    const [isSetPensiunModalOpen, setIsSetPensiunModalOpen] = useState(false);  
    const [isSetMeninggalModalOpen, setIsSetMeninggalModalOpen] = useState(false);  
    const [isSetPindahModalOpen, setIsSetPindahModalOpen] = useState(false);  
    const [isSetCutiModalOpen, setIsSetCutiModalOpen] = useState(false);  
    const [isSetBerhentiModalOpen, setIsSetBerhentiModalOpen] = useState(false);  
    const [isSubmitted, setIsSubmitted] = useState(false);  
    const [successMessage, setSuccessMessage] = useState("");  
    const [roleId, setRoleId] = useState<number | null>(null); // State untuk menyimpan role_id

    const router = useRouter();  
  
    useEffect(() => {
        // Ambil data user dari localStorage
        const storedUser  = localStorage.getItem('user');
        if (storedUser ) {
            const user = JSON.parse(storedUser ); // Parse JSON string
            setRoleId(user.role_id); // Simpan role_id ke state
        }
    }, []);
  
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
  
    const handleSubmit = async () => {  
        const isConfirmed = window.confirm("Apakah Anda yakin?");  
        if (isConfirmed) {  
            setSuccessMessage("Data Anda telah disubmit!");  
            setIsSubmitted(true);  
        }  
    };  
  
    const renderModal = (isOpen, toggleModal, title, fields) => (  
        isOpen && (  
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">  
                <div className="bg-white rounded-lg p-6 w-1/3">  
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>  
                    <form>  
                        {fields.map((field, index) => (  
                            <div key={index} className="mb-4">  
                                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">  
                                    {field.label}  
                                </label>  
                                <input  
                                    type={field.type}  
                                    id={field.id}  
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-[#3781c7] focus:border-[#3781c7]"  
                                    accept={field.accept}  
                                />  
                            </div>  
                        ))}  
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
                                className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                            >  
                                Simpan  
                            </button>  
                        </div>  
                    </form>  
                </div>  
            </div>  
        )  
    );  
  
    return (  
        <div id="profile-container" className="w-full p-2 rounded-md bg-transparent">  
            <div className="flex justify-end mb-4 pr-4 space-x-2">  
                {roleId === 1 && (  
                    <>  
                        <button  
                            className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                            onClick={() => router.push(`/edit-pegawai/${nip}`)}  
                        >  
                            <FaPencilAlt className="mr-2" /> Edit  
                        </button>  
                        <button  
                            className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                            onClick={toggleModal}  
                        >  
                            <FaExclamationTriangle className="mr-2" /> Update Kedudukan Pegawai  
                        </button>  
                        <div className="relative">  
                            <button  
                                className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
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
                        {!isSubmitted ? (  
                            <button  
                                className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                                onClick={handleSubmit}  
                            >  
                                <FaPaperPlane className="mr-2" /> Submit  
                            </button>  
                        ) : (  
                            <>  
                                <button  
                                    className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                                    onClick={() => alert("Revisi action triggered!")}  
                                >  
                                    Revisi  
                                </button>  
                                <button  
                                    className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                                    onClick={() => alert("Approve action triggered!")}  
                                >  
                                    Approve  
                                </button>  
                            </>  
                        )}  
                    </>  
                )}  

                {roleId === 4 && (  
                    <>  
                        <button  
                            className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                            onClick={() => router.push(`/edit-pegawai/${nip}`)}  
                        >  
                            <FaPencilAlt className="mr-2" /> Edit  
                        </button>  
                        <button  
                            className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"  
                            onClick={handleSubmit}  
                        >  
                            <FaPaperPlane className="mr-2" /> Submit  
                        </button>  
                    </>  
                )}  

                {(roleId === 1 || roleId === 4) && (  
                    <button className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700">  
                        <FaDownload className="mr-2" /> Download Data Pegawai  
                    </button>  
                )}  
            </div>  
  
            {successMessage && (  
                <div className="text-green-600 font-bold mb-4">  
                    {successMessage}  
                </div>  
            )}  
  
            {renderModal(isModalOpen, toggleModal, "Update Kedudukan Pegawai", [  
                { id: "kedudukan", label: "Kedudukan Pegawai", type: "text" },  
                { id: "nomorSk", label: "Nomor SK", type: "text" },  
                { id: "tanggalSk", label: "Tanggal SK", type: "date" },  
                { id: "tmt", label: "TMT Kedudukan", type: "date" },  
            ])}  
  
            {renderModal(isSetPensiunModalOpen, toggleSetPensiunModal, "Cek Status Update Pegawai", [  
                { id: "noSkPensiun", label: "No SK Pensiun", type: "text" },  
                { id: "tmtSkPensiun", label: "TMT SK Pensiun", type: "date" },  
            ])}  
  
            {renderModal(isSetMeninggalModalOpen, toggleSetMeninggalModal, "Cek Update Status Kepegawaian", [  
                { id: "noSkMeninggal", label: "No SK Meninggal", type: "text" },  
                { id: "tmtSkMeninggal", label: "TMT SK Meninggal", type: "date" },  
                { id: "penyebabKematian", label: "Penyebab Kematian", type: "text" },  
                { id: "suratKeterangan", label: "Upload Surat Keterangan", type: "file", accept: ".pdf, .doc, .docx, .jpg, .png" },  
            ])}  
  
            {renderModal(isSetPindahModalOpen, toggleSetPindahModal, "Cek Update Status Kepegawaian", [  
                { id: "noSkPindah", label: "No SK Pindah", type: "text" },  
                { id: "tmtSkPindah", label: "TMT Pindah", type: "date" },  
                { id: "pindah", label: "Pindah Ke", type: "text" },  
            ])}  
  
            {renderModal(isSetCutiModalOpen, toggleSetCutiModal, "Cek Update Status Kepegawaian", [  
                { id: "jenisCuti", label: "Jenis Cuti", type: "text" },  
                { id: "noSkCuti", label: "No SK Cuti", type: "text" },  
                { id: "tmtCutiMulai", label: "Tanggal Cuti Mulai", type: "date" },  
                { id: "tmtCutiSelesai", label: "Tanggal Cuti Selesai", type: "date" },  
            ])}  
  
            {renderModal(isSetBerhentiModalOpen, toggleSetBerhentiModal, "Cek Update Status Kepegawaian", [  
                { id: "noSkBerhenti", label: "No SK Berhenti", type: "text" },  
                { id: "tmtSkBerhenti", label: "TMT SK Berhenti", type: "date" },  
            ])}  
        </div>  
    );  
};  
  
export default ProfileEditButtons;  