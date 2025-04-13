"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

interface AddressFormProps {
  pegawai: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPegawai: React.Dispatch<React.SetStateAction<any>>;
}

const AddressForm: React.FC<AddressFormProps> = ({ pegawai, handleChange, setPegawai }) => {
  const [dataprov, setDataprov] = useState<any[]>([]);
  const [datakota, setDatakota] = useState<any[]>([]);
  const [datakec, setDatakec] = useState<any[]>([]);
  const [dakel, setDakel] = useState<any[]>([]);

  useEffect(() => {
    getProvinsi();
  }, []);

  const fetchOptions = async (url: string, keyMap: { value: string; label: string }) => {
    try {
      const response = await axios.get(url);
      return response.data.map((item: any) => ({
        value: item[keyMap.value],
        label: item[keyMap.label],
      }));
    } catch (error) {
      console.error(`Failed to fetch data from ${url}:`, error);
      return [];
    }
  };

  const getProvinsi = async () => {
    const options = await fetchOptions("/api/master_data/provinsi", {
      value: "propinsi_id",
      label: "propinsi_nm",
    });
    setDataprov(options);
  };

  const getKota = async (idProv: string) => {
    const options = await fetchOptions(`/api/master_data/kabkot?propinsi_id=${idProv}`, {
      value: "kabupaten_id",
      label: "kabupaten_nm",
    });
    setDatakota(options);
  };

  const getKecamatan = async (idKota: string) => {
    const options = await fetchOptions(`/api/master_data/kecamatan?kabupaten_id=${idKota}`, {
      value: "kecamatan_id",
      label: "kecamatan_nm",
    });
    setDatakec(options);
  };

  const getKelurahan = async (idKec: string) => {
    const options = await fetchOptions(`/api/master_data/keldes?kecamatan_id=${idKec}`, {
      value: "id",
      label: "nama",
    });
    setDakel(options);
  };

  const handleSelectChange = (field: string, value: string | null) => {
    setPegawai((prev: any) => ({ ...prev, [field]: value }));
    if (field === "id_provinsi") {
      getKota(value || "");
      setDatakota([]);
      setDatakec([]);
      setDakel([]);
    } else if (field === "id_kota") {
      getKecamatan(value || "");
      setDatakec([]);
      setDakel([]);
    } else if (field === "id_kec") {
      getKelurahan(value || "");
      setDakel([]);
    }
  };

  return (
    <>
      {pegawai && (
        <>
          {/* Provinsi and RT in one row */}
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Provinsi:</label>
            <Select
              options={dataprov}
              value={dataprov.find((option) => option.value === pegawai.id_provinsi) || null}
              onChange={(e) => handleSelectChange("id_provinsi", e?.value || null)}
              className="w-2/6 mr-2"
            />
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>RT:</label>
            <input
              id="peg_alamat_rt"
              name="peg_alamat_rt"
              type="text"
              value={pegawai.peg_alamat_rt || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
            />
          </div>

          {/* Kab/Kota and RW in one row */}
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kab/Kota:</label>
            <Select
              options={datakota}
              value={datakota.find((option) => option.value === pegawai.id_kota) || null}
              onChange={(e) => handleSelectChange("id_kota", e?.value || null)}
              className="w-2/6 mr-2"
            />
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>RW:</label>
            <input
              id="peg_alamat_rw"
              name="peg_alamat_rw"
              type="text"
              value={pegawai.peg_alamat_rw || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
            />
          </div>

          {/* Kecamatan in a single row */}
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kecamatan:</label>
            <Select
              options={datakec}
              value={datakec.find((option) => option.value === pegawai.id_kec) || null}
              onChange={(e) => handleSelectChange("id_kec", e?.value || null)}
              className="w-2/6 mr-2"
            />
          </div>

          {/* Kelurahan and Kode Pos in one row */}
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kelurahan:</label>
            <Select
              options={dakel}
              value={dakel.find((option) => option.value === pegawai.id_kel) || null}
              onChange={(e) => handleSelectChange("id_kel", e?.value || null)}
              className="w-2/6 mr-2"
            />
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kode Pos:</label>
            <input
              id="peg_kodepos"
              name="peg_kodepos"
              type="text"
              value={pegawai.peg_kodepos || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
            />
          </div>

          {/* Telp and HP in one row */}
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Telp:</label>
            <input
              id="peg_telp"
              name="peg_telp"
              type="text"
              value={pegawai.peg_telp || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
            />
            <label className="block text-gray-700 text-sm font-bold w-1/8 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>HP:</label>
            <input
              id="peg_telp_hp"
              name="peg_telp_hp"
              type="text"
              value={pegawai.peg_telp_hp || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
            />
          </div>

          {/* Email and Email Resmi in one row */}
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Email:</label>
            <input
              id="peg_email"
              name="peg_email"
              type="text"
              value={pegawai.peg_email || ""}
              onChange={handleChange}
              className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
            />
            <label className="block text-gray-700 text-sm font-bold w-1/8 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Email Resmi:</label>
            <input
              id="peg_email_resmi"
              name="peg_email_resmi"
              type="text"
              value={pegawai.peg_email_resmi || ""}
              onChange={handleChange}
              className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
            />
          </div>
        </>
      )}
    </>
  );
};

export default AddressForm;