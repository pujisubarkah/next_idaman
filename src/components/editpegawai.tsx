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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!pegid) {
      setError("ID not found. Redirecting to the main page.");
      router.push("/edit-pegawai");
      return;
    }

    axios
      .get(`/api/pegawai_unit/${pegid}`)
      .then((response) => {
        setPegawai(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load employee data. Please try again.");
        setLoading(false);
      });
  }, [pegid, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPegawai((prevState) =>
      prevState ? { ...prevState, [name]: value } : null
    );
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

  const renderFormField = (label: string, key: string, type: string) => {
    if (type === "radio") {
      const options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ];
      return (
        <div key={key} className="mb-4">
          <label
            htmlFor={key}
            className="block text-gray-700 text-sm font-bold col-span-1 text-right pr-4"
          >
            {label}:
          </label>
          <div className="flex gap-4 mt-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name={key}
                  value={option.value}
                  checked={pegawai?.[key as keyof Pegawai] === option.value}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={option.value} className="text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="mb-4 flex items-center">
        <label
          htmlFor={key}
          className="block text-gray-700 text-sm font-bold mr-2 w-1/6"
        >
          {label}:
        </label>
        <input
          id={key}
          name={key}
          type={type}
          value={pegawai?.[key as keyof Pegawai] || ""}
          onChange={handleChange}
          placeholder={label}
          className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>
    );
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

  const formFields = [
    { label: "Satuan Kerja", key: "satuan_kerja_id", type: "text" },
    { label: "Unit Kerja", key: "unit_kerja_id", type: "text" },
    { label: "NIP", key: "peg_nip", type: "text" },
    
      { label: "Tempat Lahir", key: "peg_lahir_tempat", type: "text" },
    { label: "Nama", key: "peg_nama", type: "text" },
    { label: "Gelar Depan", key: "peg_gelar_depan", type: "text" },


    { label: "Tanggal Lahir", key: "peg_tgl_lahir", type: "date" },
    { label: "Jenis Kelamin", key: "peg_jenis_kelamin", type: "text" },
    { label: "Status Perkawinan", key: "peg_status_perkawinan", type: "text" },
    { label: "Foto", key: "peg_foto", type: "text" },
    { label: "Agama", key: "id_agama", type: "text" },
    { label: "Jenis ASN", key: "peg_jenis_asn", type: "text" },
    { label: "Jenis PNS", key: "peg_jenis_pns", type: "text" },
    { label: "Status TKD", key: "status_tkd", type: "text" },
    { label: "Status Kepegawaian", key: "peg_status_kepegawaian", type: "text" },
    { label: "CPNS TMT", key: "peg_cpns_tmt", type: "date" },
    { label: "PNS TMT", key: "peg_pns_tmt", type: "date" },
    { label: "Pendidikan Awal", key: "id_pend_awal", type: "text" },
    { label: "Tahun Pendidikan Awal", key: "peg_pend_awal_th", type: "text" },
    { label: "Pendidikan Akhir", key: "id_pend_akhir", type: "text" },
    { label: "Tahun Pendidikan Akhir", key: "peg_pend_akhir_th", type: "text" },
    { label: "Jabatan", key: "jabatan_id", type: "text" },
    { label: "Status Gaji", key: "peg_status_gaji", type: "text" },
    { label: "Kedudukan Pegawai", key: "kedudukan_pegawai", type: "text" },
    { label: "Golongan Awal", key: "gol_id_awal", type: "text" },
    { label: "Golongan TMT Awal", key: "peg_gol_tmt_awal", type: "date" },
    { label: "Golongan Akhir", key: "gol_id_akhir", type: "text" },
    { label: "Golongan TMT Akhir", key: "peg_gol_tmt_akhir", type: "date" },
    { label: "Karpeg", key: "peg_karpeg", type: "text" },
    { label: "No. Askes", key: "peg_no_askes", type: "text" },
    { label: "Karsu", key: "peg_karsutri", type: "text" },
    { label: "Bapertarum", key: "peg_bapertarum", type: "text" },
  ];

  return (
    <div className="m-2 w-full">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <h1 className="text-center font-bold uppercase mb-6">Edit Pegawai</h1>
        <div className="border p-4 rounded-lg">
          {formFields.map((field) => {
            if (field.key === "peg_nip" || field.key === "peg_nip_lama") {
              return (
                <div key="nip-fields" className="flex gap-4">
                  {renderFormField("NIP", "peg_nip", "text")}
                  {renderFormField("NIP Lama", "peg_nip_lama", "text")}
                </div>
              );
            } else if (
              field.key === "peg_gelar_depan" || field.key === "peg_gelar_belakang"
            ) {
              return (
                <div key="gelar-fields" className="flex gap-4">
                  {renderFormField("Gelar Depan", "peg_gelar_depan", "text")}
                  {renderFormField("Gelar Belakang", "peg_gelar_belakang", "text")}
                </div>
              );
            }
            return renderFormField(field.label, field.key, field.type);
          })}
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
