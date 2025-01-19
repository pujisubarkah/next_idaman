"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

interface KategoriPendidikan {
  kat_pend_id: number;
  kat_nama: string;
}

interface Pendidikan {
  kat_pend_id: number;
  id_pend: string;
  nm_pend: string;
}

interface PendidikanFormProps {
  peg_pend_awal?: string;
  peg_pend_awal_th?: string;
  peg_pend_akhir?: string;
  peg_pend_akhir_th?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormPendidikan: React.FC<PendidikanFormProps> = ({
  peg_pend_awal,
  peg_pend_awal_th,
  peg_pend_akhir,
  peg_pend_akhir_th,
  handleChange,
}) => {
  const [pendidikanData, setPendidikanData] = useState({
    pendidikanAwal: peg_pend_awal || "",
    tahunPendidikanAwal: peg_pend_awal_th || "",
    pendidikanAkhir: peg_pend_akhir || "",
    tahunPendidikanAkhir: peg_pend_akhir_th || "",
  });

  const [kategoriPendidikan, setKategoriPendidikan] = useState<KategoriPendidikan[]>([]);
  const [pendidikanOptions, setPendidikanOptions] = useState<Pendidikan[]>([]);
  const [selectedPendidikanAwal, setSelectedPendidikanAwal] = useState<Pendidikan | null>(null);
  const [selectedPendidikanAkhir, setSelectedPendidikanAkhir] = useState<Pendidikan | null>(null);

  useEffect(() => {
    const fetchKategoriPendidikan = async () => {
      try {
        const response = await axios.get("/api/master_data/kat_pendidikan");
        setKategoriPendidikan(response.data);
      } catch (error) {
        console.error("Error fetching kategori pendidikan:", error);
      }
    };

    fetchKategoriPendidikan();
  }, []);

  useEffect(() => {
    const fetchPendidikanOptions = async () => {
      const selectedKatId = kategoriPendidikan.find(kat => kat.kat_nama === pendidikanData.pendidikanAwal)?.kat_pend_id;
      if (selectedKatId) {
        try {
          const response = await axios.get(`/api/master_data/pendidikan?kat_pend_id=${selectedKatId}`);
          setPendidikanOptions(response.data);
          const selectedOption = response.data.find(option => option.id_pend === peg_pend_awal);
          setSelectedPendidikanAwal(selectedOption || null);
        } catch (error) {
          console.error("Error fetching pendidikan options:", error);
        }
      }
    };

    fetchPendidikanOptions();
  }, [pendidikanData.pendidikanAwal, kategoriPendidikan, peg_pend_awal]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPendidikanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = async (name: string, selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setPendidikanData((prev) => ({ ...prev, [name]: selectedOption.value }));

      if (name === "pendidikanAwal") {
        const selectedKatId = kategoriPendidikan.find(kat => kat.kat_nama === selectedOption.label)?.kat_pend_id;
        if (selectedKatId) {
          try {
            const response = await axios.get(`/api/master_data/pendidikan?kat_pend_id=${selectedKatId}`);
            setPendidikanOptions(response.data);
            setSelectedPendidikanAwal(null); // Reset selected option
          } catch (error) {
            console.error("Error fetching pendidikan options:", error);
          }
        }
      }
    } else {
      setPendidikanData((prev) => ({ ...prev, [name]: "" }));
      setPendidikanOptions([]);
    }
  };

  const handlePendidikanSelectChange = (name: string, selectedOption: Pendidikan | null) => {
    if (name === "pendidikanAwalBawah") {
      setSelectedPendidikanAwal(selectedOption);
    } else if (name === "pendidikanAkhirBawah") {
      setSelectedPendidikanAkhir(selectedOption);
    }
  };

  const kategoriOptions = kategoriPendidikan.map(kat => ({
    value: kat.kat_nama,
    label: kat.kat_nama,
  }));

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Pendidikan Awal:</label>
        <Select
          value={kategoriOptions.find((option) => option.value === pendidikanData.pendidikanAwal) || null}
          onChange={(selectedOption) => handleSelectChange("pendidikanAwal", selectedOption)}
          options={kategoriOptions}
          className="w-1/8 mr-80"
          classNamePrefix="select"
        />
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Tahun Pendidikan Awal:</label>
        <input
          type="text"
          id="tahun-pendidikan-awal"
          name="tahunPendidikanAwal"
          value={pendidikanData.tahunPendidikanAwal}
          onChange={handleChangeInput}
          className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>
      <div className="flex items-center mt-2">
        <Select
          id="pendidikan-awal-bawah"
          name="pendidikanAwalBawah"
          value={selectedPendidikanAwal || pendidikanOptions.find(option => option.id_pend === peg_pend_awal) || null}
          onChange={(selectedOption) => handlePendidikanSelectChange("pendidikanAwalBawah", selectedOption)}
          options={pendidikanOptions}
          getOptionLabel={(option) => option.nm_pend}
          getOptionValue={(option) => option.id_pend}
          className="mt-1 w-1/4 ml-60 mr-20"
          classNamePrefix="select"
        />
      </div>
      <span className="text-red-500 text-xs ml-60 mr-20">( Pendidikan waktu diangkat menjadi CPNS)</span>
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Pendidikan Akhir:</label>
        <Select
          value={kategoriOptions.find((option) => option.value === pendidikanData.pendidikanAkhir) || null}
          onChange={(selectedOption) => handleSelectChange("pendidikanAkhir", selectedOption)}
          options={kategoriOptions}
          className="w-1/8 mr-80"
          classNamePrefix="select"
        />
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Tahun Pendidikan Akhir:</label>
        <input
          type="text"
          id="tahun-pendidikan-akhir"
          name="tahunPendidikanAkhir"
          value={pendidikanData.tahunPendidikanAkhir}
          onChange={handleChangeInput}
          className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>
      <div className="flex items-center mt-2">
        <Select
          id="pendidikan-akhir-bawah"
          name="pendidikanAkhirBawah"
          value={selectedPendidikanAkhir}
          onChange={(selectedOption) => handlePendidikanSelectChange("pendidikanAkhirBawah", selectedOption)}
          options={pendidikanOptions}
          getOptionLabel={(option) => option.nm_pend}
          getOptionValue={(option) => option.id_pend}
          className="mt-1 w-1/4 ml-60 mr-20"
          classNamePrefix="select"
        />
      </div>
      <span className="text-red-500 text-xs ml-60 mr-20">(Pendidikan sesuai ijazah terakhir)</span>
    </div>
  );
};

export default FormPendidikan;