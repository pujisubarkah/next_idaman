"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatKGB = () => {
  interface DataKGB {
    no: number;
    golongan: string;
    gaji: string;
    nomorkgb: string;
    tanggalsk: string;
    yadkgb: string;
    tahunkgb: string;
    bulankgb: string;
    kgbtanggalsurat: string;
    nosuratkgb: string;
  }

  const [data, setData] = useState<DataKGB[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    golRuang: "",
    peraturanGajiTahun: "",
    masaKerjaTahun: "",
    gaji: "",
    noSKKGB: "",
    tanggalSKKGB: "",
    tanggalYADKGB: "",
    tahunKGB: "",
    bulanKGB: "",
    tanggalSuratKGB: "",
    noSuratKGB: "",
  });

  const formatTanggal = (tanggal: string) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} ${bulan} ${tahun}`;
  };

  const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount) + ',-';

  const fetchRiwayatKgb = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/kgb?peg_id=${nip}`);
      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        golongan: item.m_spg_golongan.nm_gol,
        gaji: formatRupiah(item.m_spg_gaji.gaji_pokok),
        nomorkgb: item.kgb_nosk,
        tanggalsk: formatTanggal(item.kgb_tglsk),
        yadkgb: item.kgb_yad,
        tahunkgb: item.kgb_thn,
        bulankgb: item.kgb_bln,
        kgbtanggalsurat: formatTanggal(item.kgb_tglsurat),
        nosuratkgb: item.kgb_nosurat
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);
  }, []);

  useEffect(() => {
    if (nip) {
      fetchRiwayatKgb(nip);
    }
  }, [nip]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Handle edit submission
        console.log("Editing form submitted:", formData);
        // Here you would typically send a PUT request to update the data
      } else {
        // Handle add submission
        console.log("Form submitted:", formData);
        // Here you would typically send a POST request to add the data
      }
      // Reset form data
      setFormData({
        golRuang: "",
        peraturanGajiTahun: "",
        masaKerjaTahun: "",
        gaji: "",
        noSKKGB: "",
        tanggalSKKGB: "",
        tanggalYADKGB: "",
        tahunKGB: "",
        bulanKGB: "",
        tanggalSuratKGB: "",
        noSuratKGB: "",
      });
      // Close the modal
      setIsModalOpen(false);
      setIsEditing(false); // Reset editing state
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (item: DataKGB) => {
    setFormData({
      golRuang: item.golongan,
      peraturanGajiTahun: "", // Populate with actual data if available
      masaKerjaTahun: "", // Populate with actual data if available
      gaji: item.gaji,
      noSKKGB: item.nomorkgb,
      tanggalSKKGB: item.tanggalsk,
      tanggalYADKGB: item.yadkgb,
      tahunKGB: item.tahunkgb,
      bulanKGB: item.bulankgb,
      tanggalSuratKGB: item.kgbtanggalsurat,
      noSuratKGB: item.nosuratkgb,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div id="kgb" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">
        Riwayat KGB
      </h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false); // Reset editing state for adding
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>No</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Golongan</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Gaji</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>KGB No SK</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Tanggal SK</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Yad KGB</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Tahun KGB</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Bulan KGB</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>KGB Tanggal Surat</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>KGB No Surat</th>
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center p-4">Tidak ada data.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.golongan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.gaji}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nomorkgb}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalsk}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.yadkgb}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tahunkgb}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.bulankgb}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.kgbtanggalsurat}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nosuratkgb}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                      onClick={() => handleEdit(item)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700" aria-label="Delete">
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h4 className="text-xl font-semibold mb-4">{isEditing ? "Edit KGB" : "Tambah Riwayat KGB"}</h4>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Gol Ruang", name: "golRuang", type: "text" },
                { label: "Peraturan Gaji Tahun", name: "peraturanGajiTahun", type: "text" },
                { label: "Masa Kerja Tahun", name: "masaKerjaTahun", type: "text" },
                { label: "Gaji", name: "gaji", type: "text" },
                { label: "No. SK KGB", name: "noSKKGB", type: "text" },
                { label: "KGB Tanggal SK", name: "tanggalSKKGB", type: "date" },
                { label: "KGB Tanggal YAD", name: "tanggalYADKGB", type: "date" },
                { label: "Tahun KGB", name: "tahunKGB", type: "text" },
                { label: "Bulan KGB", name: "bulanKGB", type: "text" },
                { label: "KGB Tanggal Surat", name: "tanggalSuratKGB", type: "date" },
                { label: "KGB No Surat", name: "noSuratKGB", type: "text" },
              ].map((field) => (
                <div className="mb-4 flex items-center" key={field.name}>
                  <label className="block text-gray-700 text-sm font-bold mr-4 w-1/3" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mr-2"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  type="submit"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatKGB;