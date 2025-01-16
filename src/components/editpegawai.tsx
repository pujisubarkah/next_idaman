"use client";  
  
import React, { useEffect, useState } from "react";  
import { useRouter, useParams } from "next/navigation";  
import Select from "react-select";  
import axios from "axios";  
import AddressForm from "./AddressForm"; // Adjust the path as necessary  
import AddressFormKTP from "./AddressFormKTP"; // Adjust the path as necessary  
import SatuanDanUnitKerja from "./SatuanDanUnitKerja"; // Adjust the path as necessary  
import GolonganForm from "./GolonganForm"; // Adjust the path as necessary  
import JabatanForm from "./jabatanForm"; // Adjust the path as necessary  
import PendidkanForm from "./pendidikanForm"; // Adjust the path as necessary  
  
interface Pegawai {  
  // Define the structure of Pegawai  
  satuan_kerja_id?: string;  
  unit_kerja_id?: string;  
  peg_nip?: string;  
  peg_nip_lama?: string;  
  peg_nama?: string;  
  id_goldar?: string;  
  peg_gelar_depan?: string;  
  peg_gelar_belakang?: string;  
  peg_lahir_tempat?: string;  
  peg_tgl_lahir?: string;  
  peg_foto?: string;  
  peg_jenis_kelamin?: string;  
  peg_status_perkawinan?: string;  
  id_agama?: string;  
  peg_jenis_asn?: string;  
  peg_jenis_pns?: string;  
  peg_status_kepegawaian?: string;  
  peg_cpns_tmt?: string;  
  peg_pns_tmt?: string;  
  gol_id_awal: string | null;  
  gol_id_akhir: string | null;  
  peg_gol_akhir_tmt?: string;  
  peg_status_gaji?: string;  
  peg_karpeg?: string;  
  peg_no_askes?: string;  
  peg_karsutri?: string;  
  peg_ktp?: string;  
  peg_npwp?: string;  
  peg_jabatan_tmt?: string;  
  peg_skpd_tmt?: string;  
  peg_eselon_tmt?: string;  
  id_status_kepegawaian?: string;  
  peg_no_rekening?: string;  
  peg_tmt_kgb?: string;  
  peg_gol_awal_tmt?: string;  
  peg_bapertarum?: string | null;  
  peg_rumah_alamat?: string;  
  id_provinsi?: string;  
  id_kota?: string;  
  id_kec?: string;  
  id_kel?: string;  
  peg_alamat_rt?: string;  
  peg_alamat_rw?: string;  
  peg_kodepos?: string;  
  peg_tel?: string;  
  peg_telp_hp?: string;  
  peg_email?: string;  
  peg_email_resmi?: string;  
  peg_rumah_alamat_ktp?: string;  
  id_provinsi_ktp?: string;  
  id_kota_ktp?: string;  
  id_kec_ktp?: string;  
  id_kel_ktp?: string;  
  peg_alamat_rt_ktp?: string;  
  peg_alamat_rw_ktp?: string;  
  peg_kodepos_ktp?: string;  
  peg_telp?: string;  
}  
  
const EditPegawai: React.FC = () => {  
  const router = useRouter();  
  const { pegid } = useParams() as { pegid: string };  
  
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);  
  const [unitKerjaData, setUnitKerjaData] = useState<any[]>([]);  
  const [agamaData, setAgamaData] = useState<any[]>([]);  
  const [goldarData, setGoldarData] = useState<any[]>([]);  
  const [statusKawinData, setStatusKawinData] = useState<any[]>([]);  
  const [jenisAsnData, setJenisAsnData] = useState<any[]>([]);  
  const [jenisPnsData, setJenisPnsData] = useState<any[]>([]);  
  const [statusPegawaiData, setStatusPegawaiData] = useState<any[]>([]);  
  const [statusKepegawaianData, setStatusKepegawaianData] = useState<any[]>([]);  
  const [golonganData, setGolonganData] = useState<any[]>([]);  
  
  const [selectedOptions, setSelectedOptions] = useState<{  
    satuanKerja: string | null,  
    unitKerja: string | null,  
    agama: string | null,  
    goldar: string | null,  
    statusKawin: string | null,  
    jenisAsn: string | null,  
    jenisPns: string | null,  
    statusPegawai: string | null,  
    statusKepegawaian: string | null,  
    golongan: string | null,  
    bapertarum: string | null,  
  }>({  
    satuanKerja: null,  
    unitKerja: null,  
    agama: null,  
    goldar: null,  
    statusKawin: null,  
    jenisAsn: null,  
    jenisPns: null,  
    statusPegawai: null,  
    statusKepegawaian: null,  
    golongan: null,  
    bapertarum: null,  
  });  
  
  const [error, setError] = useState<string | null>(null);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [isGolonganModalOpen, setIsGolonganModalOpen] = useState<boolean>(false); // State for modal visibility  
  
  useEffect(() => {  
    if (!pegid) {  
      setError("ID not found. Redirecting to the main page.");  
      router.push("/edit-pegawai");  
      return;  
    }  
  
    const fetchData = async () => {  
      try {  
        const [  
          pegawaiResponse,  
          unitKerjaResponse,  
          agamaResponse,  
          goldarResponse,  
          statusKawinResponse,  
          jenisAsnResponse,  
          jenisPnsResponse,  
          statusPegawaiResponse,  
          statusKepegawaianResponse,  
          golonganResponse,  
        ] = await Promise.all([  
          axios.get(`/api/pegawai_unit/${pegid}`),  
          axios.get("/api/master_data/unit_kerja"),  
          axios.get("/api/master_data/agama"),  
          axios.get("/api/master_data/goldar"),  
          axios.get('/api/master_data/status_kawin'),  
          axios.get('/api/master_data/jenis_asn'),  
          axios.get('/api/master_data/jenis_pns'),  
          axios.get('/api/master_data/status_pegawai'),  
          axios.get('/api/master_data/status_kepegawaian'),  
          axios.get('/api/master_data/golongan'),  
        ]);  
  
        setPegawai(pegawaiResponse.data);  
        setSelectedOptions({  
          ...selectedOptions,  
          satuanKerja: pegawaiResponse.data.satuan_kerja_id,  
          unitKerja: pegawaiResponse.data.unit_kerja_id,  
          agama: pegawaiResponse.data.id_agama,  
          goldar: pegawaiResponse.data.id_goldar,  
          statusKawin: pegawaiResponse.data.peg_status_perkawinan,  
          jenisAsn: pegawaiResponse.data.peg_jenis_asn,  
          jenisPns: pegawaiResponse.data.peg_jenis_pns,  
          statusPegawai: pegawaiResponse.data.peg_status_kepegawaian,  
          statusKepegawaian: pegawaiResponse.data.id_status_kepegawaian,  
          golongan: pegawaiResponse.data.gol_id_awal,  
          bapertarum: pegawaiResponse.data.peg_bapertarum,  
        });  
        setUnitKerjaData(unitKerjaResponse.data);  
        setAgamaData(agamaResponse.data);  
        setGoldarData(goldarResponse.data);  
        setStatusKawinData(statusKawinResponse.data);  
        setJenisAsnData(jenisAsnResponse.data);  
        setJenisPnsData(jenisPnsResponse.data);  
        setStatusPegawaiData(statusPegawaiResponse.data);  
        setStatusKepegawaianData(statusKepegawaianResponse.data);  
        setGolonganData(golonganResponse.data);  
      } catch (error) {  
        console.error("Error fetching data:", error);  
        setError("Failed to load data. Please try again.");  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    fetchData();  
  }, [pegid, router]);  
  
  

  const filteredUnitKerja = unitKerjaData  
  .filter((item) => item.satuan_kerja_id === selectedOptions.satuanKerja)  
  .flatMap((item) => item.units);  

const mapOptions = (data: any[], key: string, label: string) => {  
  return data.map(item => ({  
    value: item[key],  
    label: item[label],  
  }));
};  


  
  const agamaOptions = mapOptions(agamaData, 'id_agama', 'nm_agama');  
  const jenisAsnOptions = mapOptions(jenisAsnData, 'id', 'nama');  
  const jenisPnsOptions = mapOptions(jenisPnsData, 'id_jen_pns', 'nama_jenis');  
  const statusKepegawaianOptions = mapOptions(statusKepegawaianData, 'id_status_kepegawaian', 'status');  
  const goldarOptions = mapOptions(goldarData, 'id_goldar', 'nm_goldar');  
  
  const handleCancel = () => {  
    router.push("/edit-pegawai"); // Adjust the path as necessary  
  };  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {  
    const { name, value } = e.target;  
    setPegawai(prev => prev ? ({ ...prev, [name]: value } as Pegawai) : null);  
  };  
  
  const handleSelectChange = (name: string, selectedOption: any) => {  
    const value = selectedOption ? selectedOption.value : null;  
    setSelectedOptions(prev => ({ ...prev, [name]: value }));  
    setPegawai(prev => ({ ...prev, [name]: value } as Pegawai));  
  };  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    if (!pegawai) {  
      setError("No data to save.");  
      return;  
    }  
  
    setLoading(true);  
  
    try {  
      await axios.put(`/api/pegawai_unit/${pegid}`, pegawai);  
      router.push("/edit-pegawai");  
    } catch (error) {  
      console.error("Error updating data:", error);  
      setError("Failed to update data. Please try again.");  
    } finally {  
      setLoading(false);  
    }  
  };  

  // Function to open the Golongan modal  
  const openGolonganModal = () => {  
    setIsGolonganModalOpen(true);  
  };  
  
  // Function to handle submission from the Golongan modal  
  const handleGolonganSubmit = (updatedData: any) => {  
    console.log("Updated Golongan Data:", updatedData);  
    // You can update the pegawai state with the new golongan data if needed  
    setPegawai(prev => prev ? { ...prev, gol_id_awal: updatedData.gol_id } : null);  
    setIsGolonganModalOpen(false); // Close the modal after submission  
  };  
  
  if (loading) {  
    return <div>Loading...</div>;  
  }  
  
  if (error) {  
    return <div className="text-red-600">{error}</div>;  
  }  
  
  return (  
    <div className="m-2 w-full">  
      <form onSubmit={handleSubmit} className="w-full mx-auto">  
        <h1 className="text-center font-bold uppercase mb-6">Edit Pegawai</h1>  
        <div className="border p-4 rounded-lg">  
          <SatuanDanUnitKerja  
            selectedSatuanKerja={selectedOptions.satuanKerja}  
            setSelectedSatuanKerja={(value) => setSelectedOptions(prev => ({ ...prev, satuanKerja: value }))}  
            selectedUnitKerja={selectedOptions.unitKerja}  
            setSelectedUnitKerja={(value) => setSelectedOptions(prev => ({ ...prev, unitKerja: value }))}  
            unitKerjaData={unitKerjaData}  
            setPegawai={setPegawai}  
          />  
  
          {/* Pegawai NIP */}  
          {pegawai !== null && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">NIP:</label>  
              <input  
                id="peg_nip"  
                name="peg_nip"  
                type="text"  
                value={pegawai.peg_nip || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">NIP Lama:</label>  
              <input  
                id="peg_nip_lama"  
                name="peg_nip_lama"  
                type="text"  
                value={pegawai.peg_nip_lama || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Pegawai Nama */}  
          {pegawai !== null && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Nama Lengkap:</label>  
              <input  
                id="peg_nama"  
                name="peg_nama"  
                type="text"  
                value={pegawai.peg_nama || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Pegawai Gelar */}  
          {pegawai !== null && (  
            <div className="mb-4 flex justify-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">Gelar Depan:</label>  
              <input  
                id="peg_gelar_depan"  
                name="peg_gelar_depan"  
                type="text"  
                value={pegawai.peg_gelar_depan || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">Gelar Belakang:</label>  
              <input  
                id="peg_gelar_belakang"  
                name="peg_gelar_belakang"  
                type="text"  
                value={pegawai.peg_gelar_belakang || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Pegawai Tempat dan Tanggal Lahir */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">Tempat, Tanggal Lahir:</label>  
              <input  
                id="peg_lahir_tempat"  
                name="peg_lahir_tempat"  
                type="text"  
                value={pegawai.peg_lahir_tempat || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
              <input  
                id="peg_tgl_lahir"  
                name="peg_tgl_lahir"  
                type="date"  
                value={pegawai.peg_tgl_lahir || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Pegawai Foto */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Foto:</label>  
              <input  
                id="peg_foto"  
                name="peg_foto"  
                type="file"  
                accept="image/*"  
                onChange={(e) => {  
                  const file = e.target.files?.[0];  
                  if (file) {  
                    const reader = new FileReader();  
                    reader.onloadend = () => {  
                      setPegawai({ ...pegawai, peg_foto: reader.result as string });  
                    };  
                    reader.readAsDataURL(file);  
                  }  
                }}  
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Display Image Preview */}  
          {pegawai?.peg_foto && (  
            <div className="mt-2">  
              <img  
                src={pegawai.peg_foto}  
                alt="Preview"  
                className="w-32 h-32 object-cover rounded-md"  
              />  
            </div>  
          )}  
  
          {/* Jenis Kelamin */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Jenis Kelamin:</label>  
            <div className="flex items-center">  
              <label className="mr-4">  
                <input  
                  type="radio"  
                  name="peg_jenis_kelamin"  
                  value="Laki-laki"  
                  checked={pegawai?.peg_jenis_kelamin !== "P"}  
                  onChange={handleChange}  
                />  
                Laki-laki  
              </label>  
              <label>  
                <input  
                  type="radio"  
                  name="peg_jenis_kelamin"  
                  value="Perempuan"  
                  checked={pegawai?.peg_jenis_kelamin === "P"}  
                  onChange={handleChange}  
                />  
                Perempuan  
              </label>  
            </div>  
          </div>  
  
          {/* Status Perkawinan */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Status Perkawinan:</label>  
            <div className="flex items-center">  
              {statusKawinData.map((status) => (  
                <label key={status.id} className="mr-4">  
                  <input  
                    type="radio"  
                    name="peg_status_perkawinan"  
                    value={status.id}  
                    checked={selectedOptions.statusKawin === status.id}  
                    onChange={handleChange}  
                  />  
                  {status.status}  
                </label>  
              ))}  
            </div>  
          </div>  
  
          {/* Agama */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Agama:</label>  
            <Select  
              value={agamaOptions.find(option => option.value === selectedOptions.agama) || null}  
              onChange={(selectedOption) => handleSelectChange('agama', selectedOption)}  
              options={agamaOptions}  
              className="w-2/3"  
              classNamePrefix="react-select"  
              placeholder="Pilih Agama"  
            />  
          </div>  
  
          {/* Jenis ASN */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Jenis ASN:</label>  
            <Select  
              value={jenisAsnOptions.find(option => option.value === selectedOptions.jenisAsn) || null}  
              onChange={(selectedOption) => handleSelectChange('jenisAsn', selectedOption)}  
              options={jenisAsnOptions}  
              className="w-2/3"  
              classNamePrefix="react-select"  
              placeholder="Pilih Jenis ASN"  
            />  
          </div>  
  
          {/* Jenis PNS */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Jenis PNS:</label>  
            <Select  
              value={jenisPnsOptions.find(option => option.value === selectedOptions.jenisPns) || null}  
              onChange={(selectedOption) => handleSelectChange('jenisPns', selectedOption)}  
              options={jenisPnsOptions}  
              className="w-2/3"  
              classNamePrefix="react-select"  
              placeholder="Pilih Jenis PNS"  
            />  
          </div>  
  
          {/* Status Pegawai */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Status Pegawai:</label>  
            <div className="flex items-center w-1/8">  
              {statusPegawaiData.map((statuspegawai) => (  
                <label key={statuspegawai.status_kepegawaian_id} className="mr-4">  
                  <input  
                    type="radio"  
                    name="peg_status_kepegawaian"  
                    value={statuspegawai.status_kepegawaian_id}  
                    checked={selectedOptions.statusPegawai === statuspegawai.status_kepegawaian_id}  
                    onChange={handleChange}  
                  />  
                  {statuspegawai.stspeg_nama}  
                </label>  
              ))}  
            </div>  
  
            {/* TMT CPNS */}  
            {pegawai && (  
              <div className="flex items-center w-1/4 ml-4">  
                <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-[#87ceeb] p-2">TMT CPNS:</label>  
                <input  
                  id="peg_cpns_tmt"  
                  name="peg_cpns_tmt"  
                  type="date"  
                  value={pegawai.peg_cpns_tmt || ""}  
                  onChange={handleChange}  
                  className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
                />  
              </div>  
            )}  
  
            {/* TMT PNS */}  
            {pegawai && (  
              <div className="flex items-center w-1/4 ml-4">  
                <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-[#87ceeb] p-2">TMT PNS:</label>  
                <input  
                  id="peg_pns_tmt"  
                  name="peg_pns_tmt"  
                  type="date"  
                  value={pegawai.peg_pns_tmt || ""}  
                  onChange={handleChange}  
                  className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
                />  
              </div>  
            )}  
          </div>  
  
          <PendidkanForm />  
          <JabatanForm />  
  
          {/* Pegawai jabatan tmt */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">TMT Jabatan:</label>  
              <input  
                id="peg_jabatan_tmt"  
                name="peg_jabatan_tmt"  
                type="date"  
                value={pegawai.peg_jabatan_tmt || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Pegawai unit tmt */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">TMT Unit:</label>  
              <input  
                id="peg_unit_tmt"  
                name="peg_skpd_tmt"  
                type="date"  
                value={pegawai.peg_skpd_tmt || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Pegawai eselon tmt */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">TMT Eselon:</label>  
              <input  
                id="peg_tmt_eselon"  
                name="peg_tmt_eselon"  
                type="date"  
                value={pegawai.peg_eselon_tmt || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Status Gaji */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Status Gaji:</label>  
            <select  
              name="peg_status_gaji"  
              value={pegawai?.peg_status_gaji || ""}  
              onChange={handleChange}  
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
            >  
              <option value="" disabled>Status Gaji</option>  
              <option value="1">APBN</option>  
              <option value="2">Non APBN</option>  
            </select>  
          </div>  
  
          {/* Status Kepegawaian */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Kedudukan Pegawai:</label>  
            <Select  
              value={statusKepegawaianOptions.find(option => option.value === selectedOptions.statusKepegawaian) || null}  
              onChange={(selectedOption) => handleSelectChange('statusKepegawaian', selectedOption)}  
              options={statusKepegawaianOptions}  
              className="w-2/3"  
              classNamePrefix="react-select"  
              placeholder="Kedudukan Pegawai"  
            />  
          </div>  
  
          {/* Golongan Form */}  
          {pegawai && (  
            <GolonganForm  
              pegawai={pegawai}  
              handleChange={handleChange}  
              setPegawai={setPegawai}  
              golonganOptions={golonganData.map(golongan => ({  
                value: golongan.gol_id,  
                label: golongan.nm_gol,  
              }))}  
              golonganData={golonganData}  
            />  
          )}  
  
          {/* Karpeg dan Karsutri */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">No Karpeg:</label>  
              <input  
                id="peg_karpeg"  
                name="peg_karpeg"  
                type="text"  
                value={pegawai.peg_karpeg || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">No Karis/Karsu:</label>  
              <input  
                id="peg_karsutri"  
                name="peg_karsutri"  
                type="text"  
                value={pegawai.peg_karsutri || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Askes */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">No Askes:</label>  
              <input  
                id="peg_no_askes"  
                name="peg_no_askes"  
                type="text"  
                value={pegawai.peg_no_askes || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
            </div>  
          )}  
  
          {/* KTP dan NPWP */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">No KTP:</label>  
              <input  
                id="peg_ktp"  
                name="peg_ktp"  
                type="text"  
                value={pegawai.peg_ktp || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">NPWP:</label>  
              <input  
                id="peg_npwp"  
                name="peg_npwp"  
                type="text"  
                value={pegawai.peg_npwp || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"  
              />  
            </div>  
          )}  
  
          {/* Golongan Darah */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">Golongan Darah:</label>  
            <Select  
              value={goldarOptions.find(option => option.value === selectedOptions.goldar) || null}  
              onChange={(selectedOption) => handleSelectChange('goldar', selectedOption)}  
              options={goldarOptions}  
              className="w-2/3"  
              classNamePrefix="react-select"  
              placeholder="Pilih Golongan Darah"  
            />  
          </div>  
  
          {/* Bapetarum */}  
          <div className="mb-4 flex items-center">  
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-[#87ceeb] p-2">BAPETARUM:</label>  
            <Select  
              name="peg_bapertarum"  
              value={selectedOptions.bapertarum ? { value: selectedOptions.bapertarum, label: selectedOptions.bapertarum === "1" ? "Sudah Diambil" : "Belum Diambil" } : null}  
              onChange={(selectedOption) => {  
                const value = selectedOption ? selectedOption.value : null;  
                setSelectedOptions(prev => ({ ...prev, bapertarum: value }));  
                setPegawai(prev => ({ ...prev, peg_bapertarum: value } as Pegawai));  
              }}  
              options={[  
                { value: "1", label: "Sudah Diambil" },  
                { value: "2", label: "Belum Diambil" },  
              ]}  
              className="w-1/2"  
              classNamePrefix="react-select"  
              placeholder="Pilih"  
            />  
          </div>  
  
          {/* TMT Gaji Berkala */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">TMT Gaji Berkala Terakhir:</label>  
              <input  
                id="peg_tmt_kgb"  
                name="peg_tmt_kgb"  
                type="date"  
                value={pegawai.peg_tmt_kgb || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
            </div>  
          )}  
  
          {/* No Rekening */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">No Rekening:</label>  
              <input  
                id="peg_no_rekening"  
                name="peg_no_rekening"  
                type="text"  
                value={pegawai.peg_no_rekening || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
            </div>  
          )}  
  
          {/* Alamat Rumah */}  
          {pegawai && (  
            <div className="mb-4 flex items-center">  
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">Alamat Rumah:</label>  
              <input  
                id="peg_rumah_alamat"  
                name="peg_rumah_alamat"  
                type="text"  
                value={pegawai.peg_rumah_alamat || ""}  
                onChange={handleChange}  
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
              />  
            </div>  
          )}  
  
          <AddressForm pegawai={pegawai} handleChange={handleChange} setPegawai={setPegawai} />  
  
          {/* Alamat Rumah KTP */}  
          {pegawai && (  
            <div className="mb-4">  
              <h2 className="text-lg font-bold mb-2">Alamat Domisili (Sesuai KTP)</h2>  
              <div className="flex items-center mb-4">  
                <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-[#87ceeb] p-2">Alamat Rumah:</label>  
                <input  
                  id="peg_rumah_alamat_ktp"  
                  name="peg_rumah_alamat_ktp"  
                  type="text"  
                  value={pegawai.peg_rumah_alamat_ktp || ""}  
                  onChange={handleChange}  
                  className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"  
                />  
              </div>  
            </div>  
          )}  
  
          <AddressFormKTP pegawai={pegawai} handleChange={handleChange} setPegawai={setPegawai} />  
  
          {/* Submit and Cancel Buttons */}  
          <div className="flex items-center justify-center mt-4">  
            <button  
              type="button"  
              onClick={handleCancel}  
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
        </div>  
      </form>  
    </div>  
  );  
};  
  
export default EditPegawai;  
