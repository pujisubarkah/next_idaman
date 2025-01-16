import React, { useState, useEffect } from "react";  
import axios from "axios";  
  
interface UpdateGolonganModalProps {  
  isOpen: boolean;  
  onClose: () => void;  
  onSubmit: (formData: any) => void;  
  golonganData: { gol_id: string; nm_gol: string }[];  
  pegId?: string; // pegId adalah NIP pegawai  
}  
  
const UpdateGolonganModal: React.FC<UpdateGolonganModalProps> = ({  
  isOpen,  
  onClose,  
  onSubmit,  
  golonganData,  
  pegId,  
}) => {  
  const [formData, setFormData] = useState({  
    golRuangan: "",  
    masaKerjaTahun: "",  
    masaKerjaBulan: "",  
    nomorSK: "",  
    tanggalSK: "",  
    jabatanPenandatangan: "",  
    tmt: "",  
    unitKerja: "",  
  });  
  
  // Fetch riwayat data when the modal opens  
  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        if (isOpen && pegId) { // Ensure pegId is defined  
          console.log("Fetching data for NIP:", pegId);  
          const riwayatResponse = await axios.get(  
            `/api/riwayat/pangkat/${pegId}` // Adjusted to use the dynamic route  
          );  
  
          console.log("Response from riwayat API:", riwayatResponse.data);  
  
          // Check if the response contains data  
          if (Array.isArray(riwayatResponse.data) && riwayatResponse.data.length > 0) {  
            const lastRecord = riwayatResponse.data[0]; // Assuming the first record is the latest  
            console.log("Last record found:", lastRecord);  
            setFormData({  
              golRuangan: lastRecord.gol_id || "",  
              masaKerjaTahun: lastRecord.riw_pangkat_thn || "",  
              masaKerjaBulan: lastRecord.riw_pangkat_bln || "",  
              nomorSK: lastRecord.riw_pangkat_sk || "",  
              tanggalSK: lastRecord.riw_pangkat_sktgl || "",  
              jabatanPenandatangan: lastRecord.riw_pangkat_pejabat || "",  
              tmt: lastRecord.riw_pangkat_tmt || "",  
              unitKerja: lastRecord.riw_pangkat_unit_kerja || "",  
            });  
          } else {  
            console.log("No records found for the given pegId.");  
            // Optionally, you can reset the formData or show a message  
            setFormData({  
              golRuangan: "",  
              masaKerjaTahun: "",  
              masaKerjaBulan: "",  
              nomorSK: "",  
              tanggalSK: "",  
              jabatanPenandatangan: "",  
              tmt: "",  
              unitKerja: "",  
            });  
          }  
        } else {  
          console.log("pegId is not defined or modal is not open.");  
        }  
      } catch (error) {  
        console.error("Error fetching data:", error);  
        alert("Failed to fetch data. Please try again later.");  
      }  
    };  
  
    fetchData();  
  }, [isOpen, pegId]); // Dependency array includes isOpen and pegId  
  
  const handleChange = (  
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>  
  ) => {  
    const { name, value } = e.target;  
    setFormData((prev) => ({ ...prev, [name]: value }));  
  };  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    console.log("Submitting form data:", formData); // Debugging form submission  
  
    try {  
      const response = await axios.put(`/api/riwayat/pangkat/${pegId}`, {  
        gol_id: formData.golRuangan,  
        riw_pangkat_thn: formData.masaKerjaTahun,  
        riw_pangkat_bln: formData.masaKerjaBulan,  
        riw_pangkat_sk: formData.nomorSK,  
        riw_pangkat_sktgl: formData.tanggalSK,  
        riw_pangkat_pejabat: formData.jabatanPenandatangan,  
        riw_pangkat_tmt: formData.tmt,  
        riw_pangkat_unit_kerja: formData.unitKerja,  
      });  
  
      console.log("Update response:", response.data);  
      onSubmit(response.data); // Call the onSubmit prop with the updated data  
      onClose(); // Close the modal after submission  
    } catch (error) {  
      console.error("Error updating data:", error);  
      alert("Failed to update data. Please try again later.");  
    }  
  };  
  
  if (!isOpen) return null; // Don't render if modal is not open  
  
  return (  
    <div className="fixed inset-0 flex items-center justify-center z-50">  
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">  
        <h2 className="text-lg font-bold mb-4">Update Golongan</h2>  
        <form onSubmit={handleSubmit}>  
          {/* Gol Ruang Dropdown */}  
          <div className="mb-4">  
            <label className="block text-gray-700">Gol Ruang:</label>  
            <select  
              name="golRuangan"  
              value={formData.golRuangan}  
              onChange={handleChange}  
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"  
              required  
            >  
              <option value="">Pilih Golongan</option>  
              {golonganData.map((golongan) => (  
                <option key={golongan.gol_id} value={golongan.gol_id}>  
                  {golongan.nm_gol}  
                </option>  
              ))}  
            </select>  
          </div>  
  
          {/* Masa Kerja Tahun */}  
          <div className="mb-4">  
            <label className="block text-gray-700">Masa Kerja Tahun:</label>  
            <input  
              name="masaKerjaTahun"  
              type="number"  
              value={formData.masaKerjaTahun}  
              onChange={handleChange}  
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"  
              required  
            />  
          </div>  
  
          {/* Masa Kerja Bulan */}  
          <div className="mb-4">  
            <label className="block text-gray-700">Masa Kerja Bulan:</label>  
            <input  
              name="masaKerjaBulan"  
              type="number"  
              value={formData.masaKerjaBulan}  
              onChange={handleChange}  
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"  
              required  
            />  
          </div>  
  
          {/* Nomor SK */}  
          <div className="mb-4">  
            <label className="block text-gray-700">Nomor SK:</label>  
            <input  
              name="nomorSK"  
              type="text"  
              value={formData.nomorSK}  
              onChange={handleChange}  
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"  
              required  
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
              required  
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
              required  
            />  
          </div>  
  
          {/* TMT */}  
          <div className="mb-4">  
            <label className="block text-gray-700">TMT:</label>  
            <input  
              name="tmt"  
              type="date"  
              value={formData.tmt}  
              onChange={handleChange}  
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"  
              required  
            />  
          </div>  
  
          {/* Unit Kerja */}  
          <div className="mb-4">  
            <label className="block text-gray-700">Unit Kerja:</label>  
            <input  
              name="unitKerja"  
              type="text"  
              value={formData.unitKerja}  
              onChange={handleChange}  
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"  
              required  
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
              className="bg-teal-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"  
            >  
              Simpan  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  );  
};  
  
export default UpdateGolonganModal;  
