import React, { useEffect, useState } from "react";
import Select from "react-select"; // Import react-select

interface UpdateJabatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UpdateJabatanModal: React.FC<UpdateJabatanModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    satuanKerja: null,
    unitKerja: null,
    jenisJabatan: null,
    namaJabatan: null, // Change to null for Select
    noSK: "",
    tanggalSK: "",
    jabatanPenandatangan: "",
    tmtJabatan: "",
    tmtUnit: "",
    tmtEselon: "",
  });

  const [satuanKerjaOptions, setSatuanKerjaOptions] = useState([]);
  const [unitKerjaOptions, setUnitKerjaOptions] = useState([]);
  const [jenisJabatanOptions, setJenisJabatanOptions] = useState([]);
  const [namaJabatanOptions, setNamaJabatanOptions] = useState([]); // New state for nama jabatan options

  useEffect(() => {
    if (isOpen) {
      // Fetch options from the API when the modal opens
      const fetchOptions = async () => {
        try {
          const response = await fetch('/api/jabatan');
          const data = await response.json();
          // Assuming the API returns an array of objects with id and name
          setSatuanKerjaOptions(data.satuanKerja); // Adjust based on your API response structure
          setUnitKerjaOptions(data.unitKerja); // Adjust based on your API response structure
          setJenisJabatanOptions(data.jenisJabatan); // Adjust based on your API response structure
          setNamaJabatanOptions(data.namaJabatan); // Fetch nama jabatan options
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };

      fetchOptions();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, selectedOption: any) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption }));
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
            <Select
              name="satuanKerja"
              value={formData.satuanKerja}
              onChange={(selectedOption) => handleSelectChange('satuanKerja', selectedOption)}
              options={satuanKerjaOptions}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Unit Kerja */}
          <div className="mb-4">
            <label className="block text-gray-700">Unit Kerja:</label>
            <Select
              name="unitKerja"
              value={formData.unitKerja}
              onChange={(selectedOption) => handleSelectChange('unitKerja', selectedOption)}
              options={unitKerjaOptions}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Jenis Jabatan */}
          <div className="mb-4">
            <label className="block text-gray-700">Jenis Jabatan:</label>
            <Select
              name="jenisJabatan"
              value={formData.jenisJabatan}
              onChange={(selectedOption) => handleSelectChange('jenisJabatan', selectedOption)}
              options={ jenisJabatanOptions}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Nama Jabatan */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Jabatan:</label>
            <Select
              name="namaJabatan"
              value={formData.namaJabatan}
              onChange={(selectedOption) => handleSelectChange('namaJabatan', selectedOption)}
              options={namaJabatanOptions} // Use the new state for options
              className="basic-single"
              classNamePrefix="select"
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