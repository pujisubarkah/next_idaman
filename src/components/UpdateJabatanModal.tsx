// UpdateJabatanModal.tsx
import React, { useState } from "react";

interface UpdateJabatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UpdateJabatanModal: React.FC<UpdateJabatanModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    satuanKerja: "",
    unitKerja: "",
    jenisJabatan: "",
    namaJabatan: "",
    noSK: "",
    tanggalSK: "",
    jabatanPenandatangan: "",
    tmtJabatan: "",
    tmtUnit: "",
    tmtEselon: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-lg font-bold mb-4">Update Jabatan</h2>
        <form onSubmit={handleSubmit}>
          {/* Satuan Kerja */}
          <div className="mb-4">
            <label className="block text-gray-700">Satuan Kerja:</label>
            <input
              name="satuanKerja"
              type="text"
              value={formData.satuanKerja}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
            />
          </div>

          {/* Jenis Jabatan */}
          <div className="mb-4">
            <label className="block text-gray-700">Jenis Jabatan:</label>
            <input
              name="jenisJabatan"
              type="text"
              value={formData.jenisJabatan}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Nama Jabatan */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Jabatan:</label>
            <input
              name="namaJabatan"
              type="text"
              value={formData.namaJabatan}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* No SK */}
          <div className="mb-4">
            <label className="block text-gray-700">No SK:</label>
            <input
              name="noSK"
              type="text"
              value={formData.noSK}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
            />
          </div>

          {/* TMT Jabatan */}
          <div className="mb-4">
            <label className="block text-gray-700">TMT Jabatan:</label>
            <input
              name="tmtJabatan"
              type="date"
              value={formData.tmtJabatan}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* TMT Unit */}
          <div className="mb-4">
            <label className="block text-gray-700">TMT Unit:</label>
            <input
              name="tmtUnit"
              type="date"
              value={formData.tmtUnit}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* TMT Eselon */}
          <div className="mb-4">
            <label className="block text-gray-700">TMT Eselon:</label>
            <input
              name="tmtEselon"
              type="date"
              value={formData.tmtEselon}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJabatanModal;