"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Select from "react-select";

const RiwayatPenghargaan = () => {
  interface DataPenghargaan {
    no: number;
    namaPenghargaan: string;
    nomorSK: string;
    tanggalSK: string;
    jabatanPenandatangan: string;
    instansi: string;
    lokasi: string;
  }

  interface PenghargaanOption {
    value: number;
    label: string;
  }

  const [data, setData] = useState<DataPenghargaan[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState<DataPenghargaan | null>(null);
  const [formData, setFormData] = useState<DataPenghargaan>({
    no: 0,
    namaPenghargaan: '',
    nomorSK: '',
    tanggalSK: '',
    jabatanPenandatangan: '',
    instansi: '',
    lokasi: '',
  });
  const [penghargaanOptions, setPenghargaanOptions] = useState<PenghargaanOption[]>([]);

  // Fungsi untuk memformat tanggal
  const formatTanggal = (tanggal: string) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} - ${bulan} - ${tahun}`;
  };

  const fetchRiwayatPenghargaan = async (nip: string) => {
    try {
      const response = await axios.get(`/api/kinerja/penghargaan?peg_id=${nip}`);

      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        namaPenghargaan: item.penghargaan_nm,
        nomorSK: item.riw_penghargaan_sk,
        tanggalSK: formatTanggal(item.riw_penghargaan_tglsk),
        jabatanPenandatangan: item.riw_penghargaan_pejabat,
        instansi: item.riw_penghargaan_instansi,
        lokasi: item.riw_penghargaan_lokasi,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPenghargaanOptions = async () => {
    try {
      const response = await axios.get(`/api/master_data/penghargaan`);
      const options = response.data.map((item: any) => ({
        value: item.penghargaan_id,
        label: item.penghargaan_nm,
      }));
      setPenghargaanOptions(options);
    } catch (error) {
      console.error("Error fetching penghargaan options:", error);
    }
  };



  useEffect(() => {
    // Mendapatkan NIP dari URL
    const path = window.location.pathname;
    const segments = path.split("/"); // Memecah URL menjadi array
    const nipFromUrl = segments[segments.length - 1]; // Ambil elemen terakhir (NIP)
    setNip(nipFromUrl);
  }, []); // Hanya dijalankan sekali ketika komponen pertama kali dimuat

  useEffect(() => {
    if (nip) {
      // Fetch data hanya jika nip tersedia
      fetchRiwayatPenghargaan(nip);
    }
  }, [nip]); // Dependency pada nip, hanya akan dijalankan ketika nip berubah

  useEffect(() => {
    fetchPenghargaanOptions(); // Ambil data penghargaan saat komponen dimuat
  }, []);

  const openModal = (isEdit: boolean, data: DataPenghargaan | null = null) => {
    setIsModalOpen(true);
    setIsEditMode(isEdit);
    if (isEdit && data) {
      setSelectedData(data);
      setFormData(data); // Populate form with selected data
    } else {
      setFormData({
        no: 0,
        namaPenghargaan: '',
        nomorSK: '',
        tanggalSK: '',
        jabatanPenandatangan: '',
        instansi: '',
        lokasi: '',
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption: PenghargaanOption | null) => {
    setFormData({ ...formData, namaPenghargaan: selectedOption ? String(selectedOption.value) : '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing data
        await axios.put(`/api/kinerja/penghargaan/${selectedData?.no}`, formData);
      } else {
        // Add new data
        await axios.post(`/api/kinerja/penghargaan`, formData);
      }
      fetchRiwayatPenghargaan(nip!); // Refresh data
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (no) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`/api/kinerja/penghargaan/${no}`);
        if (nip) {
          fetchRiwayatPenghargaan(nip);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };
  
  return (
    <div id="penghargaan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">RIWAYAT PENGHARGAAN</h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"
          onClick={() => openModal(false)}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
        <thead className="bg-[#3781c7] text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">No</th>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Nama Penghargaan</th>
            <th colSpan={3} className="p-3 border border-[#f2bd1d]">Surat Keputusan</th>
            <th colSpan={2} className="p-3 border border-[#f2bd1d]">Instansi Penyelenggara</th>
            <th rowSpan={2} className="p-3 border border-[#f2bd1d]">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-[#f2bd1d]">Nomor</th>
            <th className="p-3 border border-[#f2bd1d]">Tanggal</th>
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan</th>
            <th className="p-3 border border-[#f2bd1d]">Instansi</th>
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.namaPenghargaan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.nomorSK}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSK}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>
                <td className="p-3 border border-[#f2bd1d]">{item.lokasi}</td>
                <td className="p-3 border border-[#f2bd1d]">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                      onClick={() => openModal(true, item)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                    >
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
            <h2 className="text-2xl font-semibold mb-4">
              {isEditMode ? "Edit Data Penghargaan" : "Tambah Data Penghargaan"}
            </h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center">
  <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="namaPenghargaan">
    Nama Penghargaan
  </label>
  <Select
    id="namaPenghargaan"
    name="namaPenghargaan"
    options={penghargaanOptions}
    onChange={handleSelectChange}
    isClearable
    placeholder="Pilih Penghargaan"
    className="w-2/3" // Mengatur lebar dropdown
    classNamePrefix="select"
  />
</div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="nomorSK">
                  Nomor SK
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nomorSK"
                  name="nomorSK"
                  type="text"
                  value={formData.nomorSK}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="tanggalSK">
                  Tanggal SK
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tanggalSK"
                  name="tanggalSK"
                  type="date"
                  value={formData.tanggalSK}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="jabatanPenandatangan">
                  Jabatan Penandatangan SK
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="jabatanPenandatangan"
                  name="jabatanPenandatangan"
                  type="text"
                  value={formData.jabatanPenandatangan}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="instansi">
                  Instansi
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="instansi"
                  name="instansi"
                  type="text"
                  value={formData.instansi}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="lokasi">
                  Lokasi
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lokasi"
                  name="lokasi"
                  type="text"
                  value={formData.lokasi}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 w-1/3" htmlFor="fileBukti">
                  File Bukti (Sertifikat/SK)
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fileBukti"
                  name="fileBukti"
                  type="file"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                  type="button"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  {isEditMode ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPenghargaan;