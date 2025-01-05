// UpdateGolonganModal.tsx
import React, { useState } from "react";


interface UpdateGolonganModalProps {

  isOpen: boolean;

  onClose: () => void;

  golonganData: { gol_id: string; nm_gol: string }[]; // Add golonganData prop
  onSubmit: (formData: any) => void; // Add onSubmit prop

}

const UpdateGolonganModal: React.FC<UpdateGolonganModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    golRuangan: "",
    masaKerjaTahun: "",
    masaKerjaBulan: "",
    nomorSK: "",
    tanggalSK: "",
    jabatanPenandatangan: "",
    tmt: "",
    unitKerja: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Call the onSubmit function with the collected data
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // If the modal is not open, return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-lg font-bold mb-4">Update Golongan</h2>
        <form onSubmit={handleSubmit}>
          {/* Gol Ruang */}
          <div className="mb-4">
            <label className="block text-gray-700">Gol Ruang:</label>
            <input
              name="golRuangan"
              type="text"
              value={formData.golRuangan}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Masa Kerja Tahun */}
          <div className="mb-4">
            <label className="block text-gray-700">Masa Kerja Tahun:</label>
            <input
              name="masaKerjaTahun"
              type="number"
              value={formData.masaKerjaTahun}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Masa Kerja Bulan */}
          <div className="mb-4">
            <label className="block text-gray-700">Masa Kerja Bulan:</label>
            <input
              name="masaKerjaBulan"
              type="number"
              value={formData.masaKerjaBulan}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Nomor SK */}
          <div className="mb-4">
            <label className="block text-gray-700">Nomor SK:</label>
            <input
              name="nomorSK"
              type="text"
              value={formData.nomorSK}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Tanggal SK */}
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal SK:</label>
            <input
              name="tanggalSK"
              type="date"
              value={formData.tanggalSK}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Jabatan Penandatangan SK */}
          <div className="mb-4">
            <label className="block text-gray-700">Jabatan Penandatangan SK:</label>
            <input
              name="jabatanPenandatangan"
              type="text"
              value={formData.jabatanPenandatangan}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* TMT */}
          <div className="mb-4">
            <label className="block text-gray-700">TMT:</label>
            <input
              name="tmt"
              type="date"
              value={formData.tmt}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Unit Kerja */}
          <div className="mb-4">
            <label className="block text-gray-700">Unit Kerja:</label>
            <input
              name="unitKerja"
              type="text"
              value={formData.unitKerja}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
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
      </div>
    </div>
  );
};

export default UpdateGolonganModal;
