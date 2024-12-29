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

const EditPegawai: React.FC = () => {
  const router = useRouter();
  const { pegid } = useParams() as { pegid: string };
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [unitKerjaData, setUnitKerjaData] = useState<any[]>([]);
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string | null>(null);
  const [selectedUnitKerja, setSelectedUnitKerja] = useState<string | null>(null);
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
        const pegawaiResponse = await axios.get(`/api/pegawai_unit/${pegid}`);
        setPegawai(pegawaiResponse.data);
        setSelectedSatuanKerja(pegawaiResponse.data.satuan_kerja_id);
        setSelectedUnitKerja(pegawaiResponse.data.unit_kerja_id);
      } catch {
        setError("Failed to load employee data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUnitKerjaData = async () => {
      try {
        const response = await axios.get("/api/master_data/unit_kerja");
        setUnitKerjaData(response.data);
      } catch {
        console.error("Failed to load unit kerja data.");
      }
    };

    fetchData();
    fetchUnitKerjaData();
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
    const value = e.target .value;
    setSelectedUnitKerja(value);
    if (pegawai) {
      setPegawai({ ...pegawai, unit_kerja_id: value });
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

  if (error !== null) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="m-2 w-full">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <h1 className="text-center font-bold uppercase mb-6">Edit Pegawai</h1>
        <div className="border p-4 rounded-lg">
          
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 text-right">Satuan Kerja:</label>
            <select
              value={selectedSatuanKerja || ""}
              onChange={handleSatuanKerjaChange}
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              <label className="block text-gray-700 text-sm font-bold w-1/3 pr-4 text-right">Unit Kerja:</label>
              <select
                value={selectedUnitKerja || ""}
                onChange={handleUnitKerjaChange}
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

          {pegawai && Object.keys(pegawai).map((key) => (
            key !== 'satuan_kerja_id' && key !== 'unit_kerja_id' && (
              <div key={key} className="mb-4 flex items-center">
                <label htmlFor={key} className="block text-gray-700 text-sm font-bold w-1/3 pr-4 text-right">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                </label>
                <input
                  id={key}
                  name={key}
                  type="text"
                  value={pegawai[key as keyof Pegawai] || ""}
                  onChange={handleChange}
                  className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                />
              </div>
            )
          ))}
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPegawai;