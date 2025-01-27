import React, { useState, useEffect } from "react";  
import Select from "react-select";

  
interface Pendidikan {  
  no: number;  
  tingpend: string;  
  jurusan: string;  
  riw_pendidikan_sttb_ijazah: string;  
  riw_pendidikan_tanggal: string;  
  riw_pendidikan_pejabat: string;  
  riw_pendidikan_nm: string;  
  riw_pendidikan_lokasi: string;  
}  
  
interface TingkatPendidikan {  
  tingpend_id: number;  
  nm_tingpend: string;  
}  
  
interface Jurusan {  
  jurusan_id: number;  
  jurusan_nm: string;  
}  
  
interface PendidikanModalProps {  
  isOpen: boolean;  
  onClose: () => void;  
  modalType: "add" | "edit" | "delete" | null;  
  selectedData: Pendidikan | null;  
  tingkatPendidikanOptions: TingkatPendidikan[];  
  jurusanOptions: Jurusan[];  
  handleAdd: (newData: Pendidikan) => void;  
  handleEdit: (updatedData: Pendidikan) => void;  
  handleDelete: () => void;  
}  
  
const PendidikanModal: React.FC<PendidikanModalProps> = ({  
  isOpen,  
  onClose,  
  modalType,  
  selectedData,  
  tingkatPendidikanOptions,  
  jurusanOptions,  
  handleAdd,  
  handleEdit,  
  handleDelete,  
}) => {  
  const [formData, setFormData] = useState<Pendidikan>({  
    no: 0,  
    tingpend: "",  
    jurusan: "",  
    riw_pendidikan_sttb_ijazah: "",  
    riw_pendidikan_tanggal: "",  
    riw_pendidikan_pejabat: "",  
    riw_pendidikan_nm: "",  
    riw_pendidikan_lokasi: "",  
  });  
  
  useEffect(() => {  
    if (selectedData) {  
      setFormData(selectedData);  
    }  
  }, [selectedData]);  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setFormData({  
      ...formData,  
      [name]: value,  
    });  
  };  

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null,
    fieldName: "tingpend" | "jurusan"
  ) => {
    setFormData({
      ...formData,
      [fieldName]: selectedOption ? selectedOption.value : "",
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
              ? "Tambah Data"  
              : modalType === "edit"  
              ? "Edit Data"  
              : "Hapus Data"}  
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
                <label className="block font-medium">Tingkat Pendidikan</label>
                <Select
                  name="tingpend"
                  options={tingkatPendidikanOptions.map((option) => ({
                    value: option.nm_tingpend,
                    label: option.nm_tingpend,
                  }))}
                  value={
                    formData.tingpend
                      ? {
                          value: formData.tingpend,
                          label: formData.tingpend,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "tingpend")
                  }
                  isClearable
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Jurusan</label>
                <Select
                  name="jurusan"
                  options={jurusanOptions.map((option) => ({
                    value: option.jurusan_nm,
                    label: option.jurusan_nm,
                  }))}
                  value={
                    formData.jurusan
                      ? {
                          value: formData.jurusan,
                          label: formData.jurusan,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "jurusan")
                  }
                  isClearable
                />
              </div>
              <div className="mb-4">  
                <label className="block font-medium">Nama Sekolah</label>  
                <input  
                  type="text"  
                  name="riw_pendidikan_nm"  
                  className="border p-2 w-full"  
                  value={formData.riw_pendidikan_nm}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Lokasi Sekolah</label>  
                <input  
                  type="text"  
                  name="riw_pendidikan_lokasi"  
                  className="border p-2 w-full"  
                  value={formData.riw_pendidikan_lokasi}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Nomor Ijazah/STTB</label>  
                <input  
                  type="text"  
                  name="riw_pendidikan_sttb_ijazah"  
                  className="border p-2 w-full"  
                  value={formData.riw_pendidikan_sttb_ijazah}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Tanggal Ijazah/STTB</label>  
                <input  
                  type="date"  
                  name="riw_pendidikan_tanggal"  
                  className="border p-2 w-full"  
                  value={formData.riw_pendidikan_tanggal}  
                  onChange={handleChange}  
                  required  
                />  
              </div>  
              <div className="mb-4">  
                <label className="block font-medium">Nama Kepala Sekolah/Rektor</label>  
                <input  
                  type="text"  
                  name="riw_pendidikan_pejabat"  
                  className="border p-2 w-full"  
                  value={formData.riw_pendidikan_pejabat}  
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
  
export default PendidikanModal;  
