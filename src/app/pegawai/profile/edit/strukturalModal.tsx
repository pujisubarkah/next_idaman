import React, { useState, useEffect } from "react";  
  
interface PelatihanStruktural {
  no: number;
  nama_diklat: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jumlah_jam: number;
  no_sttp: string;
  tanggal_sttp: string;
  jabatan_penandatangan_sttp: string;
  penyelenggara_diklat: string;
  tempat_diklat: string;
}

interface Diklat {  
  no: number;  
  nama_diklat: string;  
  tanggal_mulai: string;  
  tanggal_selesai: string;  
  jumlah_jam: number;  
  no_sttp: string;  
  tanggal_sttp: string;  
  jabatan_penandatangan_sttp: string;  
  penyelenggara_diklat: string;  
  tempat_diklat: string;  
}  
  
interface DiklatModalProps {  
  isOpen: boolean;
  type: "add" | "edit" | "delete" | null;
  modalType: "add" | "edit" | "delete" | null;
  selectedData: PelatihanStruktural | null;  
  onClose: () => void;  
  onAdd: (newData: PelatihanStruktural) => void;  
  onEdit: (updatedData: PelatihanStruktural) => void;  
  onDelete: () => void;  
  handleAdd: (newData: PelatihanStruktural) => void;
  handleEdit: (updatedData: PelatihanStruktural) => void;
  handleDelete: () => void;
}  
  
  
const DiklatModal: React.FC<DiklatModalProps> = ({  
  isOpen,  
  onClose,  
  modalType,  
  selectedData,  
  handleAdd,  
  handleEdit,  
  handleDelete,  
}) => {  
  const [formData, setFormData] = useState<Diklat>({  
    no: 0,  
    nama_diklat: "",  
    tanggal_mulai: "",  
    tanggal_selesai: "",  
    jumlah_jam: 0,  
    no_sttp: "",  
    tanggal_sttp: "",  
    jabatan_penandatangan_sttp: "",  
    penyelenggara_diklat: "",  
    tempat_diklat: "",  
  });  
  
  useEffect(() => {  
    if (selectedData) {  
      setFormData(selectedData);  
    }  
  }, [selectedData]);  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const { name, value } = e.target;  
    setFormData({  
      ...formData,  
      [name]: value,  
    });  
  };  
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    if (modalType === "add") {  
      handleAdd(formData);  
    } else if (modalType === "edit") {  
      handleEdit(formData);  
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
                  onClick={handleDelete}  
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
                  name="tanggal_mulai"  
                  className="border p-2 w-full"  
                  value={formData.tanggal_mulai}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Tanggal Selesai</label>  
                <input  
                  type="date"  
                  name="tanggal_selesai"  
                  className="border p-2 w-full"  
                  value={formData.tanggal_selesai}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Jumlah Jam</label>  
                <input  
                  type="number"  
                  name="jumlah_jam"  
                  className="border p-2 w-full"  
                  value={formData.jumlah_jam}  
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
                  name="tanggal_sttp"  
                  className="border p-2 w-full"  
                  value={formData.tanggal_sttp}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Jabatan Penandatangan STTP</label>  
                <input  
                  type="text"  
                  name="jabatan_penandatangan_sttp"  
                  className="border p-2 w-full"  
                  value={formData.jabatan_penandatangan_sttp}  
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

