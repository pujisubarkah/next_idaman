"use client";

import React, { useState } from "react";
import Select from "react-select";

const FormPendidikan = () => {
  const [pendidikanData, setPendidikanData] = useState({
    pendidikanAwal: "",
    tahunPendidikanAwal: "",
    pendidikanAkhir: "",
    tahunPendidikanAkhir: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPendidikanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, selectedOption: any) => {
    setPendidikanData((prev) => ({ ...prev, [name]: selectedOption ? selectedOption.value : "" }));
  };

  const pendidikanOptions = [
    { value: "SD", label: "SD" },
    { value: "MADRASAH DINIYAH AWALIYAH", label: "MADRASAH DINIYAH AWALIYAH" },
    { value: "S3", label: "S3" },
    { value: "S-3", label: "S-3" },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Pendidikan Awal:</label>
        <Select
          value={pendidikanOptions.find((option) => option.value === pendidikanData.pendidikanAwal)}
          onChange={(selectedOption) => handleSelectChange("pendidikanAwal", selectedOption)}
          options={pendidikanOptions}
          className="w-1/8 mr-80"
          classNamePrefix="select"
        />
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Tahun Pendidikan Awal:</label>
        <input
          type="text"
          id="tahun-pendidikan-awal"
          name="tahunPendidikanAwal"
          value={pendidikanData.tahunPendidikanAwal}
          onChange={handleChange}
          className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>
      <div className="flex items-center mt-2">
        <Select
          id="pendidikan-awal-bawah"
          name="pendidikanAwalBawah"
          value={pendidikanOptions.find((option) => option.value === pendidikanData.pendidikanAwal)}
          onChange={(selectedOption) => handleSelectChange("pendidikanAwal", selectedOption)}
          options={pendidikanOptions}
          className="mt-1 w-1/4 ml-60 mr-20"
          classNamePrefix="select"
        />
      </div>
        
      <span className="text-red-500 text-xs ml-60 mr-20">(Pendidikan waktu diangkat menjadi CPNS)</span>
      
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Pendidikan Akhir:</label>
        <Select
          value={pendidikanOptions.find((option) => option.value === pendidikanData.pendidikanAkhir)}
          onChange={(selectedOption) => handleSelectChange("pendidikanAkhir", selectedOption)}
          options={pendidikanOptions}
          className="w-1/8 mr-80"
          classNamePrefix="select"
        />
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Tahun Pendidikan Akhir:</label>
        <input
          type="text"
          id="tahun-pendidikan-akhir"
          name="tahunPendidikanAkhir"
          value={pendidikanData.tahunPendidikanAkhir}
          onChange={handleChange}
          className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>
      <div className="flex items-center mt-2">
        <Select
          id="pendidikan-akhir-bawah"
          name="pendidikanAkhirBawah"
          value={pendidikanOptions.find((option) => option.value === pendidikanData.pendidikanAkhir)}
          onChange={(selectedOption) => handleSelectChange("pendidikanAkhir", selectedOption)}
          options={pendidikanOptions}
          className="mt-1 w-1/4 ml-60 mr-20"
          classNamePrefix="select"
        />
      </div>
      <span className="text-red-500 text-xs ml-60 mr-20">(Pendidikan sesuai ijazah terakhir)</span>
    </div>
  );
};

export default FormPendidikan;
