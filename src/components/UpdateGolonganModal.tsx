import React, { useState } from "react";
import Modal from "react-modal"; // Make sure to install react-modal

interface UpdateGolonganModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void; // Function to handle the submission of data
}

const UpdateGolonganModal: React.FC<UpdateGolonganModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [golRuangan, setGolRuangan] = useState("");
    const [masaKerjaTahun, setMasaKerjaTahun] = useState("");
    const [masaKerjaBulan, setMasaKerjaBulan] = useState("");
    const [nomorSK, setNomorSK] = useState("");
    const [tanggalSK, setTanggalSK] = useState("");
    const [jabatanPenandatangan, setJabatanPenandatangan] = useState("");
    const [tmt, setTmt] = useState("");
    const [unitKerja, setUnitKerja] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            golRuangan,
            masaKerjaTahun,
            masaKerjaBulan,
            nomorSK,
            tanggalSK,
            jabatanPenandatangan,
            tmt,
            unitKerja,
        };
        onSubmit(data); // Call the onSubmit function with the collected data
        onClose(); // Close the modal after submission
    };

    if (!isOpen) return null; // If the modal is not open, return null

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2 className="text-lg font-bold mb-4">Update Golongan</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Gol Ruang:</label>
                    <input
                        type="text"
                        value={golRuangan}
                        onChange={(e) => setGolRuangan(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Masa Kerja Tahun:</label>
                    <input
                        type="number"
                        value={masaKerjaTahun}
                        onChange={(e) => setMasaKerjaTahun(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Masa Kerja Bulan:</label>
                    <input
                        type="number"
                        value={masaKerjaBulan}
                        onChange={(e) => setMasaKerjaBulan(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Nomor SK:</label>
                    <input
                        type="text"
                        value={nomorSK}
                        onChange={(e) => setNomorSK(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Tanggal SK:</label>
                    <input
                        type="date"
                        value={tanggalSK}
                        onChange={(e) => setTanggalSK(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Jabatan Penandatangan SK:</label>
                    <input
                        type="text"
                        value={jabatanPenandatangan}
                        onChange={(e ) => setJabatanPenandatangan(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">TMT:</label>
                    <input
                        type="date"
                        value={tmt}
                        onChange={(e) => setTmt(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Unit Kerja:</label>
                    <input
                        type="text"
                        value={unitKerja}
                        onChange={(e) => setUnitKerja(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="bg-teal-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateGolonganModal;