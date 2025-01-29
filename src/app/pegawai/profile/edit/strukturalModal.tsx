import React, { useEffect, useState } from "react";

interface PelatihanStruktural {
  no: number;
  kategori: string;
  kategoriParent: string;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahJam: string;
  no_sttp: string;
  tanggalSTTP: string;
  jabatanPenandatangan: string;
  instansi: string;
  lokasi: string;
  tempat_diklat: string;
  penyelenggara_diklat: string;
  nama_diklat: string;
}

interface DiklatModalProps {
  type: "add" | "edit" | "delete" | null;
  data: PelatihanStruktural | null;
  modalType: "add" | "edit" | "delete" | null;
  onClose: () => Promise<void>;
  onDelete: () => Promise<void>;
  onSubmit: () => Promise<void>;
  onAdd: (data: PelatihanStruktural) => Promise<void>;
  onEdit: (data: PelatihanStruktural) => Promise<void>;
  selectedData: PelatihanStruktural | null;
  isOpen: boolean;
}

const DiklatModal: React.FC<DiklatModalProps> = ({
  isOpen,
  onClose,
  modalType,
  selectedData,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [formData, setFormData] = useState<PelatihanStruktural>({
    no: 0,
    kategori: "",
    kategoriParent: "",
    nama: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    jumlahJam: "",
    no_sttp: "",
    tanggalSTTP: "",
    jabatanPenandatangan: "",
    instansi: "",
    lokasi: "",
    tempat_diklat: "",
    penyelenggara_diklat: "",
    nama_diklat: "",
  });

  useEffect(() => {
    if (selectedData) {
      setFormData(selectedData);
    }
  }, [selectedData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalType === "add") {
      onAdd(formData);
    } else if (modalType === "edit") {
      onEdit(formData);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-1/2">
          <h3 className="text-lg font-semibold mb-4">
            {modalType === "add"
              ? "Tambah Data Diklat"
              : modalType === "edit"
              ? "Edit Data Diklat"
              : "Hapus Data Diklat"}
          </h3>
          {modalType === "delete" ? (
            <div>
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                  onClick={onDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium">Nama Diklat</label>
                <input
                  type="text"
                  name="nama_diklat"
                  className="border p-2 w-full"
                  value={formData.nama_diklat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Tanggal Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  className="border p-2 w-full"
                  value={formData.tanggalMulai}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  className="border p-2 w-full"
                  value={formData.tanggalSelesai}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Jumlah Jam</label>
                <input
                  type="number"
                  name="jumlahJam"
                  className="border p-2 w-full"
                  value={formData.jumlahJam}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">No STTP</label>
                <input
                  type="text"
                  name="no_sttp"
                  className="border p-2 w-full"
                  value={formData.no_sttp}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Tanggal STTP</label>
                <input
                  type="date"
                  name="tanggalSTTP"
                  className="border p-2 w-full"
                  value={formData.tanggalSTTP}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Jabatan Penandatangan STTP</label>
                <input
                  type="text"
                  name="jabatanPenandatangan"
                  className="border p-2 w-full"
                  value={formData.jabatanPenandatangan}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Penyelenggara Diklat</label>
                <input
                  type="text"
                  name="penyelenggara_diklat"
                  className="border p-2 w-full"
                  value={formData.penyelenggara_diklat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Tempat Diklat</label>
                <input
                  type="text"
                  name="tempat_diklat"
                  className="border p-2 w-full"
                  value={formData.tempat_diklat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default DiklatModal;
