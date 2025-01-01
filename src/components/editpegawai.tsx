"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Alamat from "../components/alamat";

interface Pegawai {
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
  gol_id_awal?: string;
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

const EditPegawai: React.FC = (): JSX.Element => {
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
  const [provinsi, setProvinsi] = useState<any[]>([]);
  const [kabupaten, setKabupaten] = useState<any[]>([]);  
  const [kecamatan, setKecamatan] = useState<any[]>([]);
  const [kelurahan, setKelurahan] = useState<any[]>([]);

  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string | null>(null);
  const [selectedUnitKerja, setSelectedUnitKerja] = useState<string | null>(null);
  const [selectedAgama, setSelectedAgama] = useState<string | null>(null);
  const [selectedGoldar, setSelectedGoldar] = useState<string | null>(null);
  const [selectedStatusKawin, setSelectedStatusKawin] = useState<string | null>(null);
  const [selectedJenisAsn, setSelectedJenisAsn] = useState<string | null>(null);
  const [selectedJenisPns, setSelectedJenisPns] = useState<string | null>(null);
  const [selectedStatusPegawai, setSelectedStatusPegawai] = useState<string | null>(null);
  const [selectedStatusKepegawaian, setSelectedStatusKepegawaian] = useState<string | null>(null);
  const [selectedGolongan, setSelectedGolongan] = useState<string | null>(null);
  const [selectedBapertarum, setSelectedBapertarum] = useState<string | null>(null);
  const [selectedProvinsi, setSelectedProvinsi] = useState<string | null>(null);
  const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setSelectedSatuanKerja(pegawaiResponse.data.satuan_kerja_id);
        setSelectedUnitKerja(pegawaiResponse.data.unit_kerja_id);
        setUnitKerjaData(unitKerjaResponse.data);
        setAgamaData(agamaResponse.data);
        setSelectedAgama(pegawaiResponse.data.id_agama);
        setGoldarData(goldarResponse.data);
        setSelectedGoldar(pegawaiResponse.data.id_goldar);
        setSelectedStatusKawin(pegawaiResponse.data.peg_status_perkawinan);
        setStatusKawinData(statusKawinResponse.data);
        setJenisAsnData(jenisAsnResponse.data);
        setSelectedJenisAsn(pegawaiResponse.data.peg_jenis_asn);
        setJenisPnsData(jenisPnsResponse.data);
        setSelectedJenisPns(pegawaiResponse.data.peg_jenis_pns);
        setStatusPegawaiData(statusPegawaiResponse.data);
        setSelectedStatusPegawai(pegawaiResponse.data.peg_status_kepegawaian);
        setStatusKepegawaianData(statusKepegawaianResponse.data);
        setSelectedStatusKepegawaian(pegawaiResponse.data.id_status_kepegawaian);
        setGolonganData(golonganResponse.data);
        setSelectedGolongan(pegawaiResponse.data.gol_id_awal);




      } catch (error) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pegid, router]);

  const filteredUnitKerja = unitKerjaData
    .filter((item) => item.satuan_kerja_id === selectedSatuanKerja)
    .flatMap((item) => item.units);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name === "peg_bapertarum") {
        setSelectedBapertarum(value); // Update BAPETARUM state
      } else {
        setPegawai({ ...pegawai, [name]: value });
      }
    };

    useEffect(() => {
      const fetchProvinsi = async () => {
        try {
          const response = await axios.get('/api/master_data/provinsi');
          setProvinsi(response.data);
        } catch (error) {
          setError("Failed to load provinces.");
        }
      };
    
      fetchProvinsi();
    }, []);

    const handleProvinsiChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const provinsiId = e.target.value;
      setSelectedProvinsi(provinsiId);
      setSelectedKabupaten(null);
      setSelectedKecamatan(null);
      setKelurahan([]);
    
      try {
        const response = await axios.get(`/api/master_data/kabkot?provinsi_id=${provinsiId}`);
        setKabupaten(response.data);
      } catch (error) {
        setError("Gagal memuat kabupaten.");
      }
    };
    
    const handleKabupatenChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const kabupatenId = e.target.value;
      setSelectedKabupaten(kabupatenId);
      setSelectedKecamatan(null);
      setKelurahan([]);
    
      try {
        const response = await axios.get(`/api/master_data/kecamatan?kota_id=${kabupatenId}`);
        setKecamatan(response.data);
      } catch (error) {
        setError("Gagal memuat kecamatan.");
      }
    };
    
    const handleKecamatanChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const kecamatanId = e.target.value;
      setSelectedKecamatan(kecamatanId);
    
      try {
        const response = await axios.get(`/api/master_data/keldes?kecamatan_id=${kecamatanId}`);
        setKelurahan(response.data);
      } catch (error) {
        setError("Gagal memuat kelurahan.");
      }
    };







  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pegawai) {
      setError("No data to save.");
      return;
    }

    try {
      await axios.put(`/api/pegawai_unit/${pegid}`, pegawai);
      router.push("/edit-pegawai");
    } catch {
      setError("Failed to update data. Please try again.");
    }
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
        {/* Form content */}
      <h1 className="text-center font-bold uppercase mb-6">Edit Pegawai</h1>
        <div className="border p-4 rounded-lg">
          {/* Satuan Kerja */}
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Satuan Kerja:</label>
            <select
              value={selectedSatuanKerja || ""}
              onChange={(e) => {
                setSelectedSatuanKerja(e.target.value);
                setSelectedUnitKerja(null);
                if (pegawai) {
                  setPegawai({ ...pegawai, satuan_kerja_id: e.target.value, unit_kerja_id: undefined });
                }
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
    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Unit Kerja:</label>
    <select
      value={selectedUnitKerja || ""}
      onChange={(e) => {
        setSelectedUnitKerja(e.target.value);
        if (pegawai) {
          setPegawai({ ...pegawai, unit_kerja_id: e.target.value });
        }
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
        onClick={() => {
          // Handle Update Jabatan
        }}
      >
        Update Jabatan
      </button>
    </div>
  </div>
)}
          {/* Pegawai NIP */}
          {pegawai && (
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">NIP:</label>
              <input
                id="peg_nip"
                name="peg_nip"
                type="text"
                value={pegawai.peg_nip || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">NIP Lama:</label>
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
          {pegawai && (
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Nama Lengkap:</label>
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
          {pegawai && (
            <div className="mb-4 flex justify-center">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Gelar Depan:</label>
              <input
                id="peg_gelar_depan"
                name="peg_gelar_depan"
                type="text"
                value={pegawai.peg_gelar_depan || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Gelar Belakang:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Tempat, Tanggal Lahir:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Foto:</label>
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
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Jenis Kelamin:</label>
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
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Status Perkawinan:</label>
            <div className="flex items-center">
              {statusKawinData.map((status) => (
                <label key={status.id} className="mr-4">
                  <input
                    type="radio"
                    name="peg_status_perkawinan"
                    value={status.id}
                    checked={selectedStatusKawin === status.id}
                    onChange={handleChange}
                  />
                  {status.status}
                </label>
              ))}
            </div>
          </div>

          {/* Agama */}
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Agama:</label>
            <select
              value={selectedAgama || ""}
              onChange={handleChange}
              name="id_agama"
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih Agama</option>
              {agamaData.map((agama) => (
                <option key={agama.id_agama} value={agama.id_agama}>
                  {agama.nm_agama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis ASN */}
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Jenis ASN:</label>
            <select
              value={selectedJenisAsn || ""}
              onChange={handleChange}
              name="peg_jenis_asn"
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih Jenis ASN</option>
              {jenisAsnData.map((jenis_asn) => (
                <option key={jenis_asn.id} value={jenis_asn.id}>
                  {jenis_asn.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis PNS */}
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Jenis PNS:</label>
            <select
              value={selectedJenisPns || ""}
              onChange={handleChange}
              name="peg_jenis_pns"
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Jenis PNS</option>
              {jenisPnsData.map((jenis_pns) => (
                <option key={jenis_pns.id_jen_pns} value={jenis_pns.id_jen_pns}>
                  {jenis_pns.nama_jenis}
                </option>
              ))}
            </select>
          </div>

          {/* Status Pegawai */}
<div className="mb-4 flex items-center">
  <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Status Pegawai:</label>
  <div className="flex items-center w-1/8">
    {statusPegawaiData.map((statuspegawai) => (
      <label key={statuspegawai.status_kepegawaian_id} className="mr-4">
        <input
          type="radio"
          name="peg_status_kepegawaian"
          value={statuspegawai.status_kepegawaian_id}
          checked={selectedStatusPegawai === statuspegawai.status_kepegawaian_id}
          onChange={handleChange}
        />
        {statuspegawai.stspeg_nama}
      </label>
    ))}
  </div>

  {/* TMT CPNS */}
  {pegawai && (
    <div className="flex items-center w-1/4 ml-4">
      <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-teal-100 p-2">TMT CPNS:</label>
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
      <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-teal-100 p-2">TMT PNS:</label>
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

          {/* Pegawai jabatan tmt */}
          {pegawai && (
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">TMT Jabatan:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">TMT Unit:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">TMT Eselon:</label>
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
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Status Gaji:</label>
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
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Kedudukan Pegawai:</label>
            <select
              value={selectedStatusKepegawaian || ""}
              onChange={handleChange}
              name="id_status_kepegawaian"
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Kedudukan Pegawai</option>
              {statusKepegawaianData.map((statuskepegawaian) => (
                <option key={statuskepegawaian.id_status_kepegawaian} value={statuskepegawaian.id_status_kepegawaian}>
                  {statuskepegawaian.status}
                </option>
              ))}
            </select>
          </div>

      {/* Golongan and TMT gol awal */}
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Golongan Awal:</label>
        <select
          value={selectedGolongan || ""}
          onChange={handleChange}
          name="gol_id_awal"
          className="shadow border rounded w-2/8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Pilih Golongan</option>
          {golonganData && golonganData.map((golongan) => (
        <option key={golongan.gol_id} value={golongan.gol_id}>
          {golongan.nm_gol}
        </option>
          ))}
        </select>

        {pegawai && (
          <div className="flex items-center ml-4 w-1/3">
        <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 bg-teal-100 p-2">TMT Golongan Awal:</label>
        <input
          id="peg_eselon_tmt"
          name="peg_eselon_tmt"
          type="date"
          value={pegawai.peg_gol_awal_tmt || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
          </div>
        )}
      </div>


          {/* Karpeg dan Karsutri */}
          {pegawai && (
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">No Karpeg:</label>
              <input
                id="peg_karpeg"
                name="peg_karpeg"
                type="text"
                value={pegawai.peg_karpeg || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">No Karis/Karsu:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">No Askes:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">No KTP:</label>
              <input
                id="peg_ktp"
                name="peg_ktp"
                type="text"
                value={pegawai.peg_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">NPWP:</label>
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
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">Golongan Darah:</label>
            <select
              value={selectedGoldar || ""}
              onChange={handleChange}
              name="id_goldar"
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih Golongan Darah</option>
              {goldarData.map((goldar) => (
              <option key={goldar.id_goldar} value={goldar.id_goldar}>
                {goldar.nm_goldar}
              </option>
              ))}
            </select>
            </div>

            {/* Bapetarum */}
            <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">BAPETARUM:</label>
            <select
              name="peg_bapertarum"
              value={selectedBapertarum || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
            >
              <option value="" disabled>Pilih</option>
              <option value="1">Sudah Diambil</option>
              <option value="2">Belum Diambil</option>
            </select>
            </div>

            {/* TMT Gaji Berkala */}
            {pegawai && (
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">TMT Gaji Berkala Terakhir:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">No Rekening:</label>
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
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Alamat Rumah:</label>
              <input
              id="peg_rumah_alamat"
              name="peg_rumah_alamat"
              type="text"
              value={pegawai.peg_rumah_alamat || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
            </div>
            )}

<Alamat />
            {/* Provinsi, Kab/Kota, Kec, Kel/Desa, RT, RW, Kode Pos, Telp, HP, Email, Email Resmi */}
            {pegawai && (
            <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Provinsi:</label>
              <input
              id="id_provinsi"
              name="id_provinsi"
              type="text"
              value={pegawai.id_provinsi || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">RT:</label>
              <input
              id="peg_alamat_rt"
              name="peg_alamat_rt"
              type="text"
              value={pegawai.peg_alamat_rt || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            )}

            {pegawai && (
            <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kab/Kota:</label>
              <input
              id="id_kota"
              name="id_kota"
              type="text"
              value={pegawai.id_kota || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">RW:</label>
              <input
              id="peg_alamat_rw"
              name="peg_alamat_rw"
              type="text"
              value={pegawai.peg_alamat_rw || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            )}

            {pegawai && (
            <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kec:</label>
              <input
              id="id_kec"
              name="id_kec"
              type="text"
              value={pegawai.id_kec || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
            </div>
            )}

            {pegawai && (
            <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kel/Desa:</label>
              <input
              id="id_kel"
              name="id_kel"
              type="text"
              value={pegawai.id_kel || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kode Pos:</label>
              <input
              id="peg_kodepos"
              name="peg_kodepos"
              type="text"
              value={pegawai.peg_kodepos || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            )}

            {pegawai && (
            <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Telp:</label>
              <input
              id="peg_telp"
              name="peg_telp"
              type="text"
              value={pegawai.peg_telp || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">HP:</label>
              <input
              id="peg_telp_hp"
              name="peg_telp_hp"
              type="text"
              value={pegawai.peg_telp_hp || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            )}

            {pegawai && (
            <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Email:</label>
              <input
              id="peg_email"
              name="peg_email"
              type="text"
              value={pegawai.peg_email || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Email Resmi:</label>
              <input
              id="peg_email_resmi"
              name="peg_email_resmi"
              type="text"
              value={pegawai.peg_email_resmi || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            )}

            {/* Alamat Rumah KTP */}
            {pegawai && (
              <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Alamat Domisili (Sesuai KTP)</h2>
              <div className="flex items-center mb-4">
                <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Alamat Rumah:</label>
                <input
                id="peg_rumah_alamat_ktp"
                name="peg_rumah_alamat_ktp"
                type="text"
                value={pegawai.peg_rumah_alamat_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-2/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
                />
              </div>
              </div>
            )}

            {/* Provinsi, kab, kec, kel */}
            {pegawai && (
              <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Provinsi:</label>
              <input
                id="id_provinsi_ktp"
                name="id_provinsi_ktp"
                type="text"
                value={pegawai.id_provinsi_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">RT:</label>
              <input
                id="peg_alamat_rt_ktp"
                name="peg_alamat_rt_ktp"
                type="text"
                value={pegawai.peg_alamat_rt_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
              </div>
            )}

            {pegawai && (
              <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kab/Kota:</label>
              <input
                id="id_kota_ktp"
                name="id_kota_ktp"
                type="text"
                value={pegawai.id_kota_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">RW:</label>
              <input
                id="peg_alamat_rw_ktp"
                name="peg_alamat_rw_ktp"
                type="text"
                value={pegawai.peg_alamat_rw_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
              </div>
            )}

            {pegawai && (
              <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kec:</label>
              <input
                id="id_kec_ktp"
                name="id_kec_ktp"
                type="text"
                value={pegawai.id_kec_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              </div>
            )}

            {pegawai && (
              <div className="mb-4 flex justify-start ml-60">
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kel/Desa:</label>
              <input
                id="id_kel_ktp"
                name="id_kel_ktp"
                type="text"
                value={pegawai.id_kel_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
              />
              <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kode Pos:</label>
              <input
                id="peg_kodepos_ktp"
                name="peg_kodepos_ktp"
                type="text"
                value={pegawai.peg_kodepos_ktp || ""}
                onChange={handleChange}
                className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
              />
              </div>
            )}

          


          {/* Submit Button */}
          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPegawai;