"use client";

import { type } from "os";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Daftar field form
const formFields = [
    { label: "Unit Kerja", key: "unitKerja", type: "text" },
    { label: "NIP", key: "nip", type: "text" },
    { label: "Nama Lengkap", key: "namaLengkap", type: "text" },
    { label: "Gelar", key: "gelar", type: "text" },
    { label: "Tempat, Tanggal Lahir", key: "tempatTanggalLahir", type: "text" },
    { label: "Foto", key: "foto", type: "file" },
    {
        label: "Jenis Kelamin",
        key: "jenisKelamin",
        type: "radio",
        options: ["Laki-Laki", "Perempuan"],
    },
    {
        label: "Status Perkawinan",
        key: "statusPerkawinan",
        type: "radio",
        options: ["Kawin", "Belum Kawin", "Janda", "Duda"],
    },
    { label: "Agama", key: "agama", type: "text" },
    { label: "Jenis ASN", key: "jenisASN", type: "text" },
    { label: "Jenis PNS", key: "jenisPNS", type: "text" },
    { label: "Status Tunjangan", key: "statusTunjangan", type: "text" },
    {
        label: "Status Pegawai",
        key: "statusPegawai",
        type: "radio",
        options: ["CPNS", "PNS", "PPPK"],
    },
    { label: "Pendidikan Awal", key: "pendidikanAwal", type: "text" },
    { label: "Pendidikan Akhir", key: "pendidikanAkhir", type: "text" },
    { label: "Jenis Jabatan", key: "jenisJabatan", type: "text" },
    { label: "Nama Jabatan", key: "namaJabatan", type: "text" },
    { label: "Instansi", key: "instansi", type: "text" },
    { label: "Status Gaji", key: "statusGaji", type: "text" },
    { label: "Kedudukan Pegawai", key: "kedudukanPegawai", type: "text" },
    { label: "Golongan Awal", key: "golonganAwal", type: "text" },
    { label: "Golongan Akhir", key: "golonganAkhir", type: "text" },
    { label: "Masa Kerja Golongan", key: "masaKerjaGolongan", type: "text" },
    { label: "No Karpeg", key: "noKarpeg", type: "text" },
    { label: "No Askes", key: "noAskes", type: "text" },
    { label: "No KTP", key: "noKTP", type: "text" },
    { label: "Golongan Darah", key: "golonganDarah", type: "text" },
    { label: "Bapetarum", key: "bapetarum", type: "text" },
    { label: "TMT Gaji Berkala", key: "tmtGajiBerkala", type: "text" },
    { label: "Alamat Rumah", key: "alamatRumah", type: "text" },
    { label: "detail", key: "detailalamat", type: "text" },
];

const FormPegawai = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    alert("Data berhasil disimpan!");
    // Reset form
    setFormData({});
  };

  const renderFormField = (field) => {
    if (field.key === "nip") {
      return (
        <div key={field.key} className="mb-4 grid grid-cols-2 ml-10 mr-40 gap-4">
        {/* Baris Pertama */}
        {/* Bagian NIP */}
        <div className="flex items-center">
          <label className="block text-gray-700 text-sm font-bold ml-60 mr-6 w-1/10">
            NIP 
          </label>
          <input
            id="NIP"
            type="text"
            value={formData["NIP"] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                NIP: e.target.value,
              }))
            }
            placeholder="NIP"
            className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
          />
        </div>
  
        {/* Bagian NIP LAMA */}
        <div className="flex items-center">
          <label className="block text-gray-700 text-sm font-bold mr-10 w-1/8">
            NIP LAMA :
          </label>
          <input
            id="NIPLama"
            type="text"
            value={formData["NIPlama"] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                niplama: e.target.value,
              }))
            }
            placeholder="NIP Lama"
            className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
          />
        </div>
        </div>
      );
    }
    

    if (field.key === "tempatTanggalLahir") {
      return (
        <div key={field.key} className="mb-4 flex items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
            Tempat, Tanggal Lahir:
          </label>
          <div className="flex w-2/3 space-x-2">
            <input
              id="tempatLahir"
              type="text"
              value={formData["tempatLahir"] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tempatLahir: e.target.value,
                }))
              }
              placeholder="Tempat Lahir"
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
            />
            <DatePicker
              id="tanggalLahir"
              selected={formData["tanggalLahir"] || null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  tanggalLahir: date,
                }))
              }
              placeholderText="Tanggal"
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      );
    }
    
    if (field.key === "gelar") {
      // Special handling for Gelar to render front and back titles side by side
      return (
        <div key={field.key} className="mb-4 grid grid-cols-2 ml-20 mr-40 gap-4">
         <label className="block text-gray-700 text-sm font-bold ml-80 ">
            Gelar Depan:
          </label>
          <div className="flex w-2/3 space-x-2">
            <input
              id="gelarDepan"
              type="text"
              value={formData["gelarDepan"] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gelarDepan: e.target.value,
                }))
              }
              placeholder="Gelar Depan"
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
            />
            <div className="flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-10 w-1/8">
                Gelar Belakang:
              </label>
              <input
                id="gelarBelakang"
                type="text"
                value={formData["gelarBelakang"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gelarBelakang: e.target.value,
                  }))
                }
                placeholder="Gelar Belakang"
                className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
          </div>
        </div>
      );
    }
  
      if (field.key === "statusPegawai") {
        // Special handling for "Status Pegawai" with an additional "TMT CPNS" datepicker
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              {field.label}:
            </label>
            <div className="flex w-2/3 space-x-2">
              {/* Radio buttons for Status Pegawai */}
              <div className="flex items-center">
                {field.options.map((option) => (
                  <label key={option} className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name={field.key}
                      value={option}
                      checked={formData[field.key] === option}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>

              {/* DatePicker for TMT CPNS */}
<div className="flex justify-end items-center">
  <label className="text-gray-700 text-sm font-bold mr-2">TMT CPNS:</label>
  <DatePicker
    selected={formData["tmtCpns"] || null}
    onChange={(date) =>
      setFormData((prev) => ({
        ...prev,
        tmtCpns: date,
      }))
    }
    placeholderText="Tanggal TMT CPNS"
    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
    dateFormat="dd/MM/yyyy"
  />
</div>
            </div>
          </div>
        );
      }

      if (field.key === "pendidikanAwal") {
        // Special handling for "pendidikanAwal" with an additional "TMT CPNS" datepicker
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Pendidikan Awal:
            </label>
            <div className="flex w-2/6 space-x-3">
              <input
                id="gelarDepan"
                type="text"
                value={formData["gelarDepan"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gelarDepan: e.target.value,
                  }))
                }
                placeholder="Tk Pendidikan"
                className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
              <input
                id="gelarBelakang"
                type="text"
                value={formData["gelarBelakang"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gelarBelakang: e.target.value,
                  }))
                }
                placeholder="pendidikan"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            {/* Label dan input untuk TMT CPNS */}
            <div className="flex justify-end items-center">
              <label className="text-gray-700 text-sm font-bold mr-6 flex justify-end w-full"> Tahun Pendidikan Awal:</label>
              <input
                id="tmtCPNS"
                type="text"
                value={formData["tmtCPNS"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tmtCPNS: e.target.value,
                  }))
                }
                placeholder="Tahun"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
          </div>
        );
      }
      
      if (field.key === "pendidikanAkhir") {
        // Special handling for "pendidikanAwal" with an additional "TMT CPNS" datepicker
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Pendidikan Akhir:
            </label>
            <div className="flex w-2/6 space-x-3">
              <input
                id="gelarDepan"
                type="text"
                value={formData["gelarDepan"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gelarDepan: e.target.value,
                  }))
                }
                placeholder="Tk Pendidikan"
                className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
              <input
                id="gelarBelakang"
                type="text"
                value={formData["gelarBelakang"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gelarBelakang: e.target.value,
                  }))
                }
                placeholder="pendidikan"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            {/* Label dan input untuk TMT CPNS */}
            <div className="flex justify-end items-center">
              <label className="text-gray-700 text-sm font-bold mr-6 flex justify-end w-full"> Tahun Pendidikan Akhir:</label>
              <input
                id="tmtCPNS"
                type="text"
                value={formData["tmtCPNS"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tmtCPNS: e.target.value,
                  }))
                }
                placeholder="Tahun"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
          </div>
        );
      }

      if (field.key === "namaJabatan") {
        // Special handling for "Tempat, Tanggal Lahir" to create two columns
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Nama Jabatan:
            </label>
            <div className="flex w-2/3 space-x-2">
              <input
                id="namajabatan"
                type="text"
                value={formData["namajabatan"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tempatLahir: e.target.value,
                  }))
                }
                placeholder="Jabatan"
                className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
              <div className="flex justify-end items-center">
              <label className="text-gray-700 text-sm font-bold mr-6 flex justify-end w-full">
                TMT Jabatan:
              </label>
              <DatePicker
                id="tmtjabatan"
                selected={formData["tanggalLahir"] || null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    tanggalLahir: date,
                  }))
                }
                placeholderText="TMT Jabatan"
                className="shadow border rounded w-1/1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            </div>
          </div>
        );
      }

      if (field.key === "golonganAwal") {
        // Special handling for "Tempat, Tanggal Lahir" to create two columns
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Golongan Awal:
            </label>
            <div className="flex w-2/3 space-x-2">
              <input
                id="gol_awal"
                type="text"
                value={formData["golonganAwal"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tempatLahir: e.target.value,
                  }))
                }
                placeholder="golAwal"
                className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
              <div className="flex justify-end items-center">
              <label className="text-gray-700 text-sm font-bold mr-6 flex justify-end w-full">
                TMT Golongan Awal:
              </label>
              <DatePicker
                id="gol_awal"
                selected={formData["gol_awal"] || null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    gol_awal: date,
                  }))
                }
                placeholderText="TMT Golongan Awal"
                className="shadow border rounded w-1/1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            </div>
          </div>
        );
      }

      if (field.key === "golonganAkhir") {
        // Special handling for "Tempat, Tanggal Lahir" to create two columns
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Golongan Akhir:
            </label>
            <div className="flex w-2/3 space-x-2">
              <input
                id="gol_akhir"
                type="text"
                value={formData["golonganAkhir"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tempatLahir: e.target.value,
                  }))
                }
                placeholder="golAkhir"
                className="shadow border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
              <div className="flex justify-end items-center">
              <label className="text-gray-700 text-sm font-bold mr-6 flex justify-end w-full">
                TMT Golongan Akhir:
              </label>
              <DatePicker
                id="gol_akhir"
                selected={formData["gol_akhir"] || null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    gol_akhir: date,
                  }))
                }
                placeholderText="TMT Golongan Akhir"
                className="shadow border rounded w-1/1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            </div>
          </div>
        );
      }

      if (field.key === "masaKerjaGolongan") {
        // Special handling for "Masa Kerja Golongan" to create two columns
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Masa Kerja Golongan:
            </label>
            <div className="flex w-2/3 space-x-4 items-center">
              {/* Input for Tahun */}
              <div className="flex items-center space-x-2">
                <input
                  id="masaKerjaTahun"
                  type="number"
                  value={formData["masaKerjaTahun"] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      masaKerjaTahun: e.target.value,
                    }))
                  }
                  placeholder="Tahun"
                  className="shadow border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                />
                <label className="text-gray-700 text-sm font-bold">Tahun</label>
              </div>
      
              {/* Input for Bulan */}
              <div className="flex items-center space-x-2">
                <input
                  id="masaKerjaBulan"
                  type="number"
                  value={formData["masaKerjaBulan"] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      masaKerjaBulan: e.target.value,
                    }))
                  }
                  placeholder="Bulan"
                  className="shadow border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                />
                <label className="text-gray-700 text-sm font-bold">Bulan</label>
              </div>
            </div>
          </div>
        );
      }
      
      if (field.key === "detailalamat") {
        return (
          <div key={field.key} className="mb-4 grid grid-cols-2 ml-10 mr-40 gap-4">
            {/* Baris Pertama */}
            {/* Bagian Provinsi */}
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold ml-60 mr-4 w-1/10">
                Provinsi:
              </label>
              <input
                id="provinsi"
                type="text"
                value={formData["provinsi"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    provinsi: e.target.value,
                  }))
                }
                placeholder="Provinsi"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
      
            {/* Bagian RT */}
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold mr-10 w-1/8">
                RT:
              </label>
              <input
                id="RT"
                type="text"
                value={formData["RT"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    kabKota: e.target.value,
                  }))
                }
                placeholder="RT"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            {/* Baris Kedua */}
            {/* Bagian Kab/Kota */}
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold ml-60 mr-4 w-1/10">
                Kab/Kota:
              </label>
              <input
                id="KabKota"
                type="text"
                value={formData["KabKota"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    provinsi: e.target.value,
                  }))
                }
                placeholder="Kab/Kota"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
      
            {/* Bagian RW */}
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold mr-10 w-1/8">
                RW:
              </label>
              <input
                id="RW"
                type="text"
                value={formData["RW"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    kabKota: e.target.value,
                  }))
                }
                placeholder="RT"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
            {/* Baris Ketiga */}
            {/* Bagian Kac */}
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold ml-60 mr-4 w-1/10">
                Kec:
              </label>
              <input
                id="Kecammatan"
                type="text"
                value={formData["Kec"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    provinsi: e.target.value,
                  }))
                }
                placeholder="Kecamatan"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
           {/* Bagian Kodepos */}
           <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold mr-10 w-1/8">
                Kodepos:
              </label>
              <input
                id="kodepos"
                type="text"
                value={formData["RW"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    kodepos: e.target.value,
                  }))
                }
                placeholder="kodepos"
                className="shadow border rounded w-2/4 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
           {/* Baris Keempat */}
            {/* Bagian Kel */}
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold ml-60 mr-4 w-1/10">
                Kel/desa:
              </label>
              <input
                id="Kel/desa"
                type="text"
                value={formData["Kel"] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    provinsi: e.target.value,
                  }))
                }
                placeholder="Kelurahan/Desa"
                className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              />
            </div>
           {/* Bagian telepon */}
           <div className="flex items-center">
  <label className="block text-gray-700 text-sm font-bold mr-10 w-1/8">
    Telepon:
  </label>
  <input
    id="telepon"
    type="text"
    value={formData["telp"] || ""}
    onChange={(e) => {
      const value = e.target.value;
      // Memastikan hanya angka yang diizinkan
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          telp: value, // Pastikan ini telp, bukan kodepos
        }));
      }
    }}
    placeholder="Telepon"
    className="shadow border rounded w-2/4 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
  />
</div>

          </div>
        );
      }
      
  // Default handling for other fields
    switch (field.type) {
      case "text":
      case "file":
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label
              htmlFor={field.key}
              className="block text-gray-700 text-sm font-bold mr-2 w-1/6"
            >
              {field.label}:
            </label>
            <input
              id={field.key}
              type={field.type}
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      case "radio":
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              {field.label}:
            </label>
            <div className="w-2/3">
              {field.options.map((option) => (
                <label key={option} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name={field.key}
                    value={option}
                    checked={formData[field.key] === option}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="form-radio"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case "select":
        return (
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              {field.label}:
            </label>
            <select
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
              className="shadow border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih {field.label}</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };
  






  return (
    <div className="m-2 w-full">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <h1 className="text-center font-bold uppercase mb-6">Tambah Pegawai Lembaga Administrasi Negara</h1>
        <div className="border p-4 rounded-lg">
          {formFields.map((field) => renderFormField(field))}
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

export default FormPegawai;
