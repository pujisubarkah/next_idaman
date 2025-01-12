import React from 'react';
import { FaPencilAlt, FaPaperPlane, FaDownload } from 'react-icons/fa';

const UserButton: React.FC = () => {
    const handleSubmit = () => {
        const isConfirmed = window.confirm("Apakah Anda yakin?");
        if (isConfirmed) {
            alert("Data telah disubmit!"); // Replace this with your actual submission logic
        }
    };

    return (
        <div className="w-full p-2 rounded-md bg-transparent">
            {/* Buttons */}
            <div className="flex justify-end mb-4 pr-4 space-x-2">
                {/* Edit Button */}
                <button className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700">
                    <FaPencilAlt className="mr-2" />
                    Edit
                </button>

                {/* Submit Button */}
                <button
                    className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    <FaPaperPlane className="mr-2" />
                    Submit
                </button>

                {/* Download Button */}
                <button className="flex items-center bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-blue-700">
                    <FaDownload className="mr-2" />
                    Download Data Pegawai
                </button>
            </div>
        </div>
    );
};

export default UserButton;
