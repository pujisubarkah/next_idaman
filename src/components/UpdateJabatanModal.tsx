import React, { useEffect, useState } from "react";
import Select from "react-select";

interface UpdateJabatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UpdateJabatanModal: React.FC<UpdateJabatanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [satuanKerjaOptions, setSatuanKerjaOptions] = useState([]);
  const [unitKerjaOptions, setUnitKerjaOptions] = useState([]);
  const [jenisJabatanOptions, setJenisJabatanOptions] = useState<{ value: string; label: string }[]>([]);
  const [namaJabatanOptions, setNamaJabatanOptions] = useState([]);
  const [formData, setFormData] = useState<{
    satuanKerja: any;
    unitKerja: any;
    jenisJabatan: any;
    namaJabatan: any;
    noSK: string;
    tanggalSK: string;
    jabatanPenandatangan: string;
    tmtJabatan: string;
    tmtUnit: string;
    tmtEselon: string;
  }>({
    satuanKerja: null,
    unitKerja: null,
    jenisJabatan: null,
    namaJabatan: null,
    noSK: "",
    tanggalSK: "",
    jabatanPenandatangan: "",
    tmtJabatan: "",
    tmtUnit: "",
    tmtEselon: "",
  });

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async () => {
        try {
          const response = await fetch("/api/master_data/jabatan");
          const data = await response.json();

          // Format data for Satuan Kerja
          const formattedSatuanKerja = data.map((item) => ({
            value: item.satuan_kerja_id,
            label: item.satuan_kerja_nama,
            units: item.units, // Keep unit data for cascading
          }));

          setSatuanKerjaOptions(formattedSatuanKerja);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchOptions();
    }
  }, [isOpen]);

  // Handle Satuan Kerja change
  const handleSatuanKerjaChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      satuanKerja: selectedOption,
      unitKerja: null,
      jenisJabatan: null,
      namaJabatan: null,
    }));

    const units = selectedOption?.units || [];
    const formattedUnits = units.map((unit) => ({
      value: unit.unit_kerja_id,
      label: unit.unit_kerja_nama,
      children: unit.children || [], // Include nested units if available
    }));

    setUnitKerjaOptions(formattedUnits);
    setJenisJabatanOptions([]);
    setNamaJabatanOptions([]);
  };

  // Handle Unit Kerja change
  const handleUnitKerjaChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      unitKerja: selectedOption,
      jenisJabatan: null,
      namaJabatan: null,
    }));

    const children = selectedOption?.children || [];
    const formattedJenisJabatan = children.map((child) => ({
      value: child.unit_kerja_id,
      label: child.unit_kerja_nama,
      jabatan: child.jabatan, // Include jabatan data
    }));

    setJenisJabatanOptions(formattedJenisJabatan);
    setNamaJabatanOptions([]);
  };

  // Handle Jenis Jabatan change
  const handleJenisJabatanChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, jenisJabatan: selectedOption, namaJabatan: null }));

    const selectedJabatan = selectedOption?.jabatan || [];
    const formattedNamaJabatan = selectedJabatan.map((jabatan) => ({
      value: jabatan.jabatan_nama,
      label: jabatan.jabatan_nama,
    }));

    setNamaJabatanOptions(formattedNamaJabatan);
  };

  // Handle Nama Jabatan change
  const handleNamaJabatanChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, namaJabatan: selectedOption }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-2/3">
        <h2 className="text-lg font-bold mb-4">Update Jabatan</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Satuan Kerja:</label>
            <Select
              value={formData.satuanKerja}
              onChange={handleSatuanKerjaChange}
              options={satuanKerjaOptions}
              placeholder="Pilih Satuan Kerja"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Unit Kerja:</label>
            <Select
              value={formData.unitKerja}
              onChange={handleUnitKerjaChange}
              options={unitKerjaOptions}
              placeholder="Pilih Unit Kerja"
              isDisabled={!formData.satuanKerja}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jenis Jabatan:</label>
            <Select
              value={formData.jenisJabatan}
              onChange={handleJenisJabatanChange}
              options={jenisJabatanOptions}
              placeholder="Pilih Jenis Jabatan"
              isDisabled={!formData.unitKerja}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Jabatan:</label>
            <Select
              value={formData.namaJabatan}
              onChange={handleNamaJabatanChange}
              options={namaJabatanOptions}
              placeholder="Pilih Nama Jabatan"
              isDisabled={!formData.jenisJabatan}
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
