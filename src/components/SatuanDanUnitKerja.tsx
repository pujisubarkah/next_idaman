// SatuanDanUnitKerja.tsx
import React, { useState } from "react";
import UpdateJabatanModal from "./UpdateJabatanModal"; // Adjust the path as necessary

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

  return (
    <>
      {/* Satuan Kerja */}
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
          Satuan Kerja:
        </label>
        <select
          value={selectedSatuanKerja || ""}
          onChange={(e) => {
            setSelectedSatuanKerja(e.target.value);
            setSelectedUnitKerja(null);
            setPegawai((prev) => ({
              ...prev,
              satuan_kerja_id: e.target.value,
              unit_kerja_id: undefined,
            }));
          }}
          className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        >
          <option value="">Pilih Satuan Kerja</option>
          {unitKerjaData.map((item) => (
            <option key={item.satuan_kerja_id} value={item.satuan_kerja_id}>
              {item.satuan_kerja_nama}
            </option>
          ))}
        </select>
      </div>

      {/* Unit Kerja */}
      {selectedSatuanKerja && (
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
            Unit Kerja:
          </label>
          <select
            value={selectedUnitKerja || ""}
            onChange={(e) => {
              setSelectedUnitKerja(e.target.value);
              setPegawai((prev) => ({
                ...prev,
                unit_kerja_id: e.target.value,
              }));
            }}
            className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          >
            <option value="">Pilih Unit Kerja</option>
            {filteredUnitKerja.map((unit) => (
              <option key={unit.unit_kerja_id} value={unit.unit_kerja_id}>
                {unit.unit_kerja_nama}
              </option>
            ))}
          </select>
          {/* Buttons */}
          <div className="ml-4 flex space-x-2">
            <button
              type="button"
              className="bg-teal-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                // Handle Update Unit Internal
              }}
            >
              Update Unit Internal
            </button>
            <button
              type="button"
              className="bg-teal-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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