import React from 'react';
import { DataPelatihanKlasikal } from './klasikal'; // pastikan tipe data sesuai dengan di komponen utama

interface PelatihanKlasikalModalProps {
  isOpen: boolean;
  formData: DataPelatihanKlasikal;
  setFormData: React.Dispatch<React.SetStateAction<DataPelatihanKlasikal>>;
  handleCloseModal: () => void;
  handleSubmitForm: () => void;
}

const PelatihanKlasikalModal: React.FC<PelatihanKlasikalModalProps> = ({
  isOpen,
  formData,
  setFormData,
  handleCloseModal,
  handleSubmitForm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h4 className="text-lg font-semibold mb-4">{formData.no === 0 ? "Tambah Pelatihan Klasikal" : "Edit Pelatihan Klasikal"}</h4>

        {/* Form fields */}
        <div>
          <label className="block mb-2">Jenis Pelatihan</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.jenis}
            onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Nama Pelatihan</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Tanggal Mulai</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.tanggalMulai}
            onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Tanggal Selesai</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.tanggalSelesai}
            onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Nomor Sertifikat/Surat Tugas</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.nomorsurat}
            onChange={(e) => setFormData({ ...formData, nomorsurat: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Instansi Penyelenggara</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.instansi}
            onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">Jumlah Jam Pelajaran</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={formData.jumlahJam}
            onChange={(e) => setFormData({ ...formData, jumlahJam: e.target.value })}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
            onClick={handleSubmitForm}
          >
            Simpan
          </button>
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800"
            onClick={handleCloseModal}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PelatihanKlasikalModal;
