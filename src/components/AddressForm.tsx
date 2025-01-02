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

  const InputField = ({
    id,
    label,
    value,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="flex items-center mb-4">
      <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">{label}:</label>
      <input
        id={id}
        name={id}
        type="text"
        value={value || ""}
        onChange={onChange}
        className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
      />
    </div>
  );

  return (
    <>
      {pegawai && (
        <>
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Provinsi:</label>
            <Select
              options={dataprov}
              value={dataprov.find((option) => option.value === pegawai.id_provinsi) || null}
              onChange={(e) => handleSelectChange("id_provinsi", e?.value || null)}
            />
          </div>
          <div className="mb-4 flex justify-start ml-60">
            <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kab/Kota:</label>
            <Select
              options={datakota}
              value={datakota.find((option) => option.value === pegawai.id_kota) || null}
              onChange={(e) => handleSelectChange("id_kota", e?.value || null)}
            />
          </div>
          <div className="mb-4 flex justify-start ml-60">
            <InputField id="peg_alamat_rt" label="RT" value={pegawai.peg_alamat_rt} onChange={handleChange} />
            <InputField id="peg_alamat_rw" label="RW" value={pegawai.peg_alamat_rw} onChange={handleChange} />
          </div>
          <div className="mb-4 flex justify-start ml-60">
            <InputField id="peg_kodepos" label="Kode Pos" value={pegawai.peg_kodepos} onChange={handleChange} />
            <InputField id="peg_telp" label="Telp" value={pegawai.peg_telp} onChange={handleChange} />
          </div>
          <div className="mb-4 flex justify-start ml-60">
            <InputField id="peg_telp_hp" label="HP" value={pegawai.peg_telp_hp} onChange={handleChange} />
          </div>
        </>
      )}
    </>
  );
};

export default AddressForm;
