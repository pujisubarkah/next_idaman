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

interface Universitas {
  univ_id: number;
  univ_nmpti: string;
  univ_kota: string;
}
  
interface PendidikanModalProps {  
  isOpen: boolean;  
  onClose: () => void;  
  modalType: "add" | "edit" | "delete" | null;  
  selectedData: Pendidikan | null;  
  tingkatPendidikanOptions: TingkatPendidikan[];  
  jurusanOptions: Jurusan[];  
  universitasOptions: Universitas[];
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
  universitasOptions, 
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

  const [selectedUniversity, setSelectedUniversity] = useState<{ univ_nmpti: string; univ_kota: string } | null>(null);

  useEffect(() => {  
    if (selectedData) {  
      setFormData(selectedData);  
      // Set selected university based on selectedData if available
      const university = universitasOptions.find(univ => univ.univ_nmpti === selectedData.riw_pendidikan_nm);
      if (university) {
        setSelectedUniversity({ univ_nmpti: university.univ_nmpti, univ_kota: university.univ_kota });
      }
    }  
  }, [selectedData, universitasOptions]);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setFormData({  
      ...formData,  
      [name]: value,  
    });  
  };  

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null,
    fieldName: "tingpend" | "jurusan" | "univ_nmpti"
  ) => {
    if (fieldName === "univ_nmpti" && selectedOption) {
      const university = universitasOptions.find(univ => univ.univ_nmpti === selectedOption.value);
      if (university) {
        setSelectedUniversity({ univ_nmpti: university.univ_nmpti, univ_kota: university.univ_kota });
        setFormData({
          ...formData,
          riw_pendidikan_lokasi: university.univ_kota, // Automatically set the location
        });
      }
    }
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
  
  const isHigherThanSLTA = () => {
    const higherLevels = ["D1", "D2", "D3", 'D4', "S1", "S2", "S3"];
    return higherLevels.includes(formData.tingpend);
  };

  const isBasicEducation = () => {
    const basicLevels = ["SD", "SLTP", "SLTA"];
    return basicLevels.includes(formData.tingpend);
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
                <label className="block font-medium">
                  {isHigherThanSLTA() ? "Nama Perguruan Tinggi" : "Nama Sekolah"}
                </label>  
                {isHigherThanSLTA() ? (
                  <Select
                    name="univ_nmpti"
                    options={universitasOptions.map((option) => ({
                      value: option.univ_nmpti,
                      label: option.univ_nmpti,
                    }))}
                    value={selectedUniversity ? { value: selectedUniversity.univ_nmpti, label: selectedUniversity.univ_nmpti } : null}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "univ_nmpti")
                    }
                    isClearable
                  />
                ) : (
                  <input  
                    type="text"  
                    name="riw_pendidikan_nm"  
                    className="border p-2 w-full"  
                    value={formData.riw_pendidikan_nm}  
                    onChange={handleChange}  
                    required  
                  />  
                )}
              </div>  
             
              {!isBasicEducation() && ( // Only show Jurusan if not basic education
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
              )}

              <div className="mb-4">  
                <label className="block font-medium">
                  Lokasi Perguruan Tinggi
                </label>  
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
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mr-2"
                  type="button"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  type="submit"
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
