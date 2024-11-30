"use client";

import { type } from "os";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Daftar field form
const formFields = [
    { label: "Unit Kerja", key: "unitKerja", type: "text" },
    { label: "NIP", key: "nip", type: "text" },
    { label: "Gelar", key: "gelar", type: "text" },
    { label: "Nama Lengkap", key: "namaLengkap", type: "text" },
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
    { label: "TMT Jabatan", key: "tmtJabatan", type: "text" },
    { label: "Instansi", key: "instansi", type: "text" },
    { label: "Status Gaji", key: "statusGaji", type: "text" },
    { label: "Kedudukan Pegawai", key: "kedudukanPegawai", type: "text" },
    { label: "Golongan Awal", key: "golonganAwal", type: "text" },
    { label: "Golongan Akhir", key: "golonganAkhir", type: "text" },
    { label: "Masa Kerja Golongan", key: "masaKerjaGolongan", type: "text" },
    { label: "No Karpeg", key: "noKarpeg", type: "text" },
    { label: "No Askes", key: "noAskes", type: "text" },
    { label: "No KTP", key: "noKTP", type: "text" },
    { label: "Golongan Daerah", key: "golonganDaerah", type: "text" },
    { label: "Bapetarum", key: "bapetarum", type: "text" },
    { label: "TMT Gaji Berkala", key: "tmtGajiBerkala", type: "text" },
    { label: "Alamat Rumah", key: "alamatRumah", type: "text" },
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
    if (field.key === "nip" || field.key === "nipLama") {
      // Special handling for NIP and NIP Lama to render side by side
      return (
        <div key={field.key} className="mb-4 flex items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
            {field.key === "nip" ? "NIP" : "NIP Lama"}:
          </label>
          <div className="flex w-2/3 space-x-2">
            {/* Render both NIP and NIP Lama fields */}
            <input
              id="nip"
              type="text"
              value={formData["nip"] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nip: e.target.value,
                }))
              }
              placeholder="NIP"
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
            />
            <input
              id="nipLama"
              type="text"
              value={formData["nipLama"] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nipLama: e.target.value,
                }))
              }
              placeholder="NIP Lama"
              className="shadow border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
            />
          </div>
        </div>
      );
    }

    if (field.key === "tempatTanggalLahir") {
        // Special handling for "Tempat, Tanggal Lahir" to create two columns
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
          <div key={field.key} className="mb-4 flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-1/6">
              Gelar:
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

{/* Container untuk pendidikan awal */}
<div className="flex gap-4">
  {/* Kolom untuk tingkat pendidikan */}
  <div className="flex flex-col w-1/3">
    <label className="text-gray-700 text-sm font-bold mb-1">Tingkat Pendidikan:</label>
    <input
      type="text"
      className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
      placeholder="Tingkat Pendidikan"
    />
  </div>

  {/* Kolom untuk pendidikan */}
  <div className="flex flex-col w-1/3">
    <label className="text-gray-700 text-sm font-bold mb-1">Pendidikan:</label>
    <input
      type="text"
      className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
      placeholder="Pendidikan"
    />
  </div>

  {/* Kolom untuk tahun pendidikan awal */}
  <div className="flex flex-col w-1/3">
    <label className="text-gray-700 text-sm font-bold mb-1">Tahun Pendidikan Awal:</label>
    <input
      type="text"
      className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
      placeholder="Tahun Pendidikan"
    />
  </div>
</div>



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
      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
  );
};

export default FormPegawai;
