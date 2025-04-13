import React, { useState, useEffect, useCallback } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
import { FixedSizeList } from "react-window";

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

const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Universitas[] }) => {
  const option = data[index];
  return (
    <div style={style} className="p-2">
      {option.univ_nmpti}
    </div>
  );
};

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

  const [selectedUniversity, setSelectedUniversity] = useState<Universitas | null>(null);

  useEffect(() => {
    if (selectedData) {
      setFormData(selectedData);
      const university = universitasOptions.find(univ => univ.univ_nmpti === selectedData.riw_pendidikan_nm);
      if (university) {
        setSelectedUniversity(university);
      }
    }
  }, [selectedData, universitasOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectUniversity = useCallback((university: SingleValue<{ value: string; label: string }>, action: ActionMeta<{ value: string; label: string }>) => {
    if (university && action.action === "select-option") {
      const selectedUniv = universitasOptions.find(univ => univ.univ_nmpti === university.value);
      setSelectedUniversity(selectedUniv || null);
      setFormData(prevData => ({
        ...prevData,
        riw_pendidikan_lokasi: selectedUniv ? selectedUniv.univ_kota : "",
      }));
    } else {
      setSelectedUniversity(null);
      setFormData(prevData => ({
        ...prevData,
        riw_pendidikan_lokasi: "",
      }));
    }
  }, [universitasOptions]);

  const handleSelectChange = useCallback((selectedOption: SingleValue<{ value: string; label: string }>, name: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalType === "add") {
      handleAdd(formData);
    } else if (modalType === "edit") {
      handleEdit(formData);
    }
  };

  const isHigherThanSLTA = () => {
    const higherLevels = ["D1", "D2", "D3", "D4", "S1", "S2", "S3"];
    return higherLevels.includes(formData.tingpend);
  };

  const isBasicEducation = () => {
    const basicLevels = ["SD", "SLTP", "SLTA"];
    return basicLevels.includes(formData.tingpend);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-1/2 max-w-2xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {modalType === "add"
              ? "Tambah Data"
              : modalType === "edit"
              ? "Edit Data"
              : "Hapus Data"}
          </h3>
          {modalType === "delete" ? (
            <div>
              <p className="text-gray-700">Apakah Anda yakin ingin menghapus data ini?</p>
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
                <label className="block font-medium text-gray-700">Tingkat Pendidikan</label>
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
                  onChange={(selectedOption, action) => handleSelectChange(selectedOption, "tingpend")}
                  isClearable
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700">
                  {isHigherThanSLTA() ? "Nama Perguruan Tinggi" : "Nama Sekolah"}
                </label>
                {isHigherThanSLTA() ? (
                  <div>
                    <select
                      className="mt-1"
                      value={selectedUniversity ? selectedUniversity.univ_nmpti : ''}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select a university</option>
                      {universitasOptions.map((option) => (
                        <option key={option.univ_id} value={option.univ_nmpti}>
                          {option.univ_nmpti}
                        </option>
                      ))}
                    </select>

                    <FixedSizeList
                      height={200}
                      itemCount={universitasOptions.length}
                      itemSize={35}
                      width="100%"
                      itemData={universitasOptions}
                    >
                      {Row}
                    </FixedSizeList>
                  </div>
                ) : (
                  <input
                    type="text"
                    name="riw_pendidikan_nm"
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.riw_pendidikan_nm}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>

              {!isBasicEducation() && (
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Jurusan</label>
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
                    onChange={(selectedOption, action) => handleSelectChange(selectedOption, "jurusan")}
                    isClearable
                    className="mt-1"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block font-medium text-gray-700">Lokasi Perguruan Tinggi</label>
                <input
                  type="text"
                  name="riw_pendidikan_lokasi"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.riw_pendidikan_lokasi}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Nomor Ijazah/STTB</label>
                <input
                  type="text"
                  name="riw_pendidikan_sttb_ijazah"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.riw_pendidikan_sttb_ijazah}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Tanggal Ijazah/STTB</label>
                <input
                  type="date"
                  name="riw_pendidikan_tanggal"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.riw_pendidikan_tanggal}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Nama Kepala Sekolah/Rektor</label>
                <input
                  type="text"
                  name="riw_pendidikan_pejabat"
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
