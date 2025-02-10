import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface RiwayatData {
  id: number;
  namapenghargaan: string;
  tahun: string;
  tingkat: string;
  instansipemberi: string;
}

interface PrestasiPribadiProps {
  nip: string | null;
}

const PrestasiPribadi: React.FC<PrestasiPribadiProps> = ({ nip }) => {
  const [pribadiData, setPribadiData] = useState<RiwayatData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<RiwayatData>({
    id: 0,
    namapenghargaan: "",
    tahun: "",
    tingkat: "",
    instansipemberi: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRiwayatPrestasiPribadi = useCallback(async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/prestasi_pribadi?peg_id=${nip}`);
      const mappedData: RiwayatData[] = response.data.map((item: any) => ({
        id: item.prestasi_pribadi_id,
        namapenghargaan: item.nama_penghargaan,
        tahun: item.tahun,
        tingkat: item.tingkat,
        instansipemberi: item.instansi_pemberi,
      }));
      setPribadiData(mappedData);
    } catch (error) {
      console.error("Error fetching Prestasi Pribadi data:", error);
    }
  }, []);

  useEffect(() => {
    if (nip) {
      fetchRiwayatPrestasiPribadi(nip);
    }
  }, [nip, fetchRiwayatPrestasiPribadi]);

  const handleAddPrestasi = async () => {
    if (!formData.namapenghargaan || !formData.tahun || !formData.tingkat || !formData.instansipemberi) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const dataToSend = {
        peg_id: nip,
        nama_penghargaan: formData.namapenghargaan,
        tahun: parseInt(formData.tahun),
        tingkat: formData.tingkat,
        instansi_pemberi: formData.instansipemberi,
      };

      const response = await axios.post(`/api/riwayat/prestasi_pribadi`, dataToSend);
      
      const newEntry: RiwayatData = {
        id: response.data.id,
        namapenghargaan: response.data.nama_penghargaan,
        tahun: response.data.tahun,
        tingkat: response.data.tingkat,
        instansipemberi: response.data.instansi_pemberi,
      };

      setPribadiData([...pribadiData, newEntry]);
      resetForm();
    } catch (error) {
      console.error("Error adding prestasi:", error);
      setErrorMessage("Failed to add prestasi. Please try again.");
    }
  };

  const handleEditPrestasi = (id: number) => {
    const entryToEdit = pribadiData.find(item => item.id === id);
    if (entryToEdit) {
      setFormData(entryToEdit);
      setIsModalOpen(true);
    }
  };

  const handleUpdatePrestasi = async () => {
    if (!formData.namapenghargaan || !formData.tahun || !formData.tingkat || !formData.instansipemberi) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const dataToSend = {
        peg_id: nip,
        nama_penghargaan: formData.namapenghargaan,
        tahun: parseInt(formData.tahun),
        tingkat: formData.tingkat,
        instansi_pemberi: formData.instansipemberi,
      };

      const response = await axios.put(`/api/riwayat/prestasi_pribadi/${formData.id}`, dataToSend);
      
      const updatedEntry: RiwayatData = {
        ...formData,
        tahun: response.data.tahun,
      };

      setPribadiData(pribadiData.map(item => (item.id === formData.id ? updatedEntry : item)));
      resetForm();
    } catch (error) {
      console.error("Error updating prestasi:", error);
      setErrorMessage("Failed to update prestasi. Please try again.");
    }
  };

  const handleDeletePrestasi = async (id: number) => {
    try {
      await axios.delete(`/api/riwayat/prestasi_pribadi/${id}`);
      setPribadiData(pribadiData.filter(item => item.id !== id));
   } catch (error) {
      console.error("Error deleting prestasi:", error);
      setErrorMessage("Failed to delete prestasi. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      namapenghargaan: "",
      tahun: "",
      tingkat: "",
      instansipemberi: "",
    });
    setIsModalOpen(false);
    setErrorMessage(null);
  };

  const renderTable = (data: RiwayatData[], title: string, includePeran: boolean) => (
    <div className="mb-8">
      <h3 className="text-center text-xl font-semibold my-4 text-[#3781c7]">{title}</h3>
      <div className="flex justify-end mb-4">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]">No</th>
            <th className="p-3 border border-[#f2bd1d]">Nama Penghargaan</th>
            <th className="p-3 border border-[#f2bd1d]">Tahun</th>
            {includePeran && (
              <th className="p-3 border border-[#f2bd1d]">Peran</th>
            )}
            <th className="p-3 border border-[#f2bd1d]">Tingkat</th>
            <th className="p-3 border border-[#f2bd1d]">Instansi Pemberi</th>
            <th className="p-3 border border-[#f2bd1d]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={includePeran ? 7 : 6} className="text-center p-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-[#f2bd1d]">{index + 1}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  {item.namapenghargaan}
                </td>
                <td className="p-3 border border-[#f2bd1d]">{item.tahun}</td>
                {includePeran && (
                  <td className="p-3 border border-[#f2bd1d]">-</td>
                )}
                <td className="p-3 border border-[#f2bd1d]">{item.tingkat}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  {item.instansipemberi}
                </td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                      onClick={() => handleEditPrestasi(item.id)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                      onClick={() => handleDeletePrestasi(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {renderTable(pribadiData, "Prestasi Pribadi", false)}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-3/4 md:w-1/2 p-6 rounded shadow-lg">
            <h4 className="text-lg font-semibold mb-4">
              {formData.id ? "Edit" : "Tambah"} Prestasi Pribadi
            </h4>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <form onSubmit={(e) => { e.preventDefault(); formData.id ? handleUpdatePrestasi() : handleAddPrestasi(); }}>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold">Nama Prestasi</label>
                  <input
                    className="block w-full p-2 border"
                    placeholder="Nama Prestasi"
                    value={formData.namapenghargaan}
                    onChange={(e) => setFormData({ ...formData, namapenghargaan: e.target.value })}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold">Tahun</label>
                  <input
                    type="text"
                    className="block w-full p-2 border"
                    placeholder="Tahun"
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold">Tingkat</label>
                  <div className="flex space-x-4">
                    {["kota", "provinsi", "nasional", "internasional"].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="tingkat"
                          value={level}
                          checked={formData.tingkat === level}
                          onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                          className="mr-2"
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold">Instansi Pemberi</label>
                  <input
                    className="block w-full p-2 border"
                    placeholder="Instansi Pemberi"
                    value={formData.instansipemberi}
                    onChange={(e) => setFormData({ ...formData, instansipemberi: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
                    type="submit"
                  >
                    {formData.id ? "Update" : "Simpan"}
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                    onClick={resetForm}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrestasiPribadi;

