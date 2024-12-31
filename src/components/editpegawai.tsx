"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

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
  status_tkd?: string;
  peg_status_kepegawaian?: string;
  peg_cpns_tmt?: string;
  peg_pns_tmt?: string;
  id_pend_awal?: string;
  peg_pend_awal_th?: string;
  id_pend_akhir?: string;
  peg_pend_akhir_th?: string;
  jabatan_id?: string;
  peg_status_gaji?: string;
  kedudukan_pegawai?: string;
  gol_id_awal?: string;
  peg_gol_tmt_awal?: string;
  gol_id_akhir?: string;
  peg_gol_tmt_akhir?: string;
  peg_karpeg?: string;
  peg_no_askes?: string;
  peg_karsutri?: string;
  peg_bapertarum?: string | null;
}

const EditPegawai: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { pegid } = useParams() as { pegid: string };

  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [unitKerjaData, setUnitKerjaData] = useState<any[]>([]);
  const [agamaData, setAgamaData] = useState<any[]>([]);
  const [goldarData, setGoldarData] = useState<any[]>([]);
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string | null>(null);
  const [selectedUnitKerja, setSelectedUnitKerja] = useState<string | null>(null);
  const [selectedAgama, setSelectedAgama] = useState<string | null>(null);
  const [selectedGoldar, setSelectedGoldar] = useState<string | null>(null);
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
        const [pegawaiResponse, unitKerjaResponse, agamaResponse, goldarResponse] = await Promise.all([
          axios.get(`/api/pegawai_unit/${pegid}`),
          axios.get("/api/master_data/unit_kerja"),
          axios.get("/api/master_data/agama"),
          axios.get("/api/master_data/goldar"),
        ]);

        setPegawai(pegawaiResponse.data);
        setSelectedSatuanKerja(pegawaiResponse.data.satuan_kerja_id);
        setSelectedUnitKerja(pegawaiResponse.data.unit_kerja_id);
        setUnitKerjaData(unitKerjaResponse.data);
        setAgamaData(agamaResponse.data);
        setSelectedAgama(pegawaiResponse.data.id_agama);
        setGoldarData(goldarResponse.data);
        setSelectedGoldar(pegawaiResponse.data.id_goldar);
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

  const handleSatuanKerjaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSatuanKerja(value);
    setSelectedUnitKerja(null);
    if (pegawai) {
      setPegawai({ ...pegawai, satuan_kerja_id: value, unit_kerja_id: undefined });
    }
  };

  const handleUnitKerjaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedUnitKerja(value);
    if (pegawai) {
      setPegawai({ ...pegawai, unit_kerja_id: value });
    }
  };

  const handleAgamaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAgama(e.target.value);
    if (pegawai) {
      setPegawai({ ...pegawai, id_agama: e.target.value });
    }
  };

  const handleGoldarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoldar(e.target.value);
    if (pegawai) {
      setPegawai({ ...pegawai, id_goldar: e.target.value });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (pegawai) {
      setPegawai({ ...pegawai, peg_jenis_kelamin: value });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (pegawai) {
      setPegawai({ ...pegawai, [name]: value });
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
        <h1 className="text-center font-bold uppercase mb-6">Edit Pegawai</h1>
        <div className="border p-4 rounded-lg">
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-2">Satuan Kerja:</label>
            <select
              value={selectedSatuanKerja || ""}
              onChange={handleSatuanKerjaChange}
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

          {selectedSatuanKerja && (
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 text-sm font-bold w-1/3 pr-2">Unit Kerja:</label>
              <select
                value={selectedUnitKerja || ""}
                onChange={handleUnitKerjaChange}
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                <option value="">Pilih Unit Kerja</option>
                {filteredUnitKerja.map((unit) => (
                  <option key={unit.unit_kerja_id} value={unit.unit_kerja_id}>
                    {unit.unit_kerja_nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {pegawai &&
            Object.keys(pegawai).map((key) =>
              key !== "satuan_kerja_id" &&
              key !== "unit_kerja_id" && (
                <div key={key} className="mb-4 flex items-center">
                  <label
                    htmlFor={key}
                    className="block text-gray-700 text-sm font-bold w-1/3 pr-2"
                  >
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <input
                    id={key}
                    name={key}
                    type="text"
                    value={pegawai[key as keyof Pegawai] || ""}
                    onChange={handleChange}
                    className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                  />
                </div>
              )
            )}

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-2">Agama:</label>
            <select
              value={selectedAgama || ""}
              onChange={handleAgamaChange}
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

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-2">Golongan Darah:</label>
            <select
              value={selectedGoldar || ""}
              onChange={handleGoldarChange}
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

              


          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-2">Jenis Kelamin:</label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="peg_jenis_kelamin"
                  value="Laki-laki"
                  checked={pegawai?.peg_jenis_kelamin === "Laki-laki"}
                  onChange={handleGenderChange}
                />
                Laki-laki
              </label>
              <label>
                <input
                  type="radio"
                  name="peg_jenis_kelamin"
                  value="Perempuan"
                  checked={pegawai?.peg_jenis_kelamin === "Perempuan"}
                  onChange={handleGenderChange}
                />
                Perempuan
              </label>
            </div>
          </div>

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
