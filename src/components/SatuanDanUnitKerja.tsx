// SatuanDanUnitKerja.tsx
import React, { useState } from "react";
import UpdateJabatanModal from "./UpdateJabatanModal"; // Adjust the path as necessary
import Select from "react-select"; // Import react-select

interface SatuanDanUnitKerjaProps {
  selectedSatuanKerja: string | null;
  setSelectedSatuanKerja: (value: string | null) => void;
  selectedUnitKerja: string | null;
  setSelectedUnitKerja: (value: string | null) => void;
  unitKerjaData: any[];
  setPegawai: (data: any) => void;
}

const SatuanDanUnitKerja: React.FC<SatuanDanUnitKerjaProps> = ({
  selectedSatuanKerja,
  setSelectedSatuanKerja,
  selectedUnitKerja,
  setSelectedUnitKerja,
  unitKerjaData,
  setPegawai,
}) => {
  const filteredUnitKerja = unitKerjaData
    .filter((item) => item.satuan_kerja_id === selectedSatuanKerja)
    .flatMap((item) => item.units);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateJabatan = (data: any) => {
    // Handle the update logic here, e.g., send data to the API
    console.log("Updated Jabatan Data:", data);
    setIsModalOpen(false); // Close the modal after submission
  };

  // Prepare options for Satuan Kerja
  const satuanKerjaOptions = unitKerjaData.map(item => ({
    value: item.satuan_kerja_id,
    label: item.satuan_kerja_nama,
  }));

  // Prepare options for Unit Kerja
  const unitKerjaOptions = filteredUnitKerja.map(unit => ({
    value: unit.unit_kerja_id,
    label: unit.unit_kerja_nama,
  }));

  return (
    <>
      {/* Satuan Kerja */}
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">
          Satuan Kerja:
        </label>
        <Select
          value={satuanKerjaOptions.find(option => option.value === selectedSatuanKerja) || null}
          onChange={(selectedOption) => {
            setSelectedSatuanKerja(selectedOption ? selectedOption.value : null);
            setSelectedUnitKerja(null);
            setPegawai((prev) => ({
              ...prev,
              satuan_kerja_id: selectedOption ? selectedOption.value : null,
              unit_kerja_id: undefined,
            }));
          }}
          options={satuanKerjaOptions}
          className="w-2/3"
          classNamePrefix="react-select"
          placeholder="Pilih Satuan Kerja"
        />
      </div>

      {/* Unit Kerja */}
      {selectedSatuanKerja && (
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">
            Unit Kerja:
          </label>
          <Select
            value={unitKerjaOptions.find(option => option.value === selectedUnitKerja) || null}
            onChange={(selectedOption) => {
              setSelectedUnitKerja(selectedOption ? selectedOption.value : null);
              setPegawai((prev) => ({
                ...prev,
                unit_kerja_id: selectedOption ? selectedOption.value : null,
              }));
            }}
            options={unitKerjaOptions}
            className="w-2/6"
            classNamePrefix="react-select"
            placeholder="Pilih Unit Kerja"
          />
          {/* Buttons */}
          <div className="ml-4 flex space-x-2">
            <button
              type="button"
              className="bg-[#3781c7] hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                // Handle Update Unit Internal
              }}
            >
              Update Unit Internal </button>
            <button
              type="button"
              className="bg-[#3781c7] hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsModalOpen(true)} // Open the modal
            >
              Update Jabatan
            </button>
          </div>
        </div>
      )}

      {/* Update Jabatan Modal */}
      <UpdateJabatanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateJabatan}
      />
    </>
  );
};

export default SatuanDanUnitKerja;