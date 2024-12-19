import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// Interface untuk data pelatihan klasikal
interface DataPelatihanKlasikal {
  no: number;
  jenis: string;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  nomorsurat: string;
  instansi: string;
  jumlahJam: string;
}

const RiwayatPelatihanKlasikal = () => {
  const [data, setData] = useState<DataPelatihanKlasikal[]>([]);
  const [nip, setNip] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataPelatihanKlasikal>({
    no: 0,
    jenis: "",
    nama: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    nomorsurat: "",
    instansi: "",
    jumlahJam: "",
  });

  // Fungsi untuk memformat tanggal
  const formatTanggal = (tanggal: string) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} - ${bulan} - ${tahun}`;
  };

  // Fetch data pelatihan klasikal berdasarkan nip
  const fetchRiwayatPelatihanKlasikal = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/pelatihan_klasikal?peg_id=${nip}`);
      const sortedData = response.data.sort(
        (a: any, b: any) => new Date(a.riw_tgl_lahir).getTime() - new Date(b.riw_tgl_lahir).getTime()
      );

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        jenis: item.jenis_pelatihan,
        nama: item.non_nama,
        tanggalMulai: item.non_tgl_mulai,
        tanggalSelesai: item.non_tgl_selesai,
        nomorsurat: item.non_sttp,
        instansi: item.non_penyelenggara,
        jumlahJam: item.diklat_jumlah_jam,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal mengambil data. Silakan coba lagi nanti.");
    }
  };

  // Handle modal form
  const handleOpenModal = (item?: DataPelatihanKlasikal) => {
    if (item) {
      setFormData(item); // Edit mode
    } else {
      setFormData({
        no: 0,
        jenis: "",
        nama: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        nomorsurat: "",
        instansi: "",
        jumlahJam: "",
      }); // Add mode
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handle submit form
  const handleSubmitForm = async () => {
    try {
      if (formData.no === 0) {
        // Tambah data
        await axios.post("/api/riwayat/pelatihan_klasikal", formData);
      } else {
        // Edit data
        await axios.put(`/api/riwayat/pelatihan_klasikal/${formData.no}`, formData);
      }
      fetchRiwayatPelatihanKlasikal(nip!); // Refresh data
      setModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal menyimpan data. Silakan coba lagi nanti.");
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
      fetchRiwayatPelatihanKlasikal(nip);
    }
  }, [nip]);

  return (
    <div id="pelatihan-klasikal" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">Riwayat Pelatihan Klasikal</h3>

      <div className="flex justify-end mb-4">
        <button
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
          onClick={() => handleOpenModal()}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-teal-500" rowSpan={2}>No</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Jenis Pelatihan</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Nama Pelatihan</th>
            <th className="p-3 border border-teal-500" colSpan={2}>Tanggal</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Nomor Sertifikat/Surat Tugas</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Instansi Penyelenggara</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Jumlah Jam Pelajaran</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Tidak ada data.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.jenis}</td>
                <td className="p-3 border border-teal-500">{item.nama}</td>
                <td className="p-3 border border-teal-500">{formatTanggal(item.tanggalMulai)}</td>
                <td className="p-3 border border-teal-500">{formatTanggal(item.tanggalSelesai)}</td>
                <td className="p-3 border border-teal-500">{item.nomorsurat}</td>
                <td className="p-3 border border-teal-500">{item.instansi}</td>
                <td className="p-3 border border-teal-500">{item.jumlahJam}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleOpenModal(item)}
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

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h4 className="text-lg font-semibold mb-4">{formData.no === 0 ? "Tambah Pelatihan" : "Edit Pelatihan"}</h4>
            <div>
              <label className="block mb-2">Jenis Pelatihan</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Nama Pelatihan</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.tanggalMulai}
                onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Tanggal Selesai</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.tanggalSelesai}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Nomor Sertifikat/Surat Tugas</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.nomorsurat}
                onChange={(e) => setFormData({ ...formData, nomorsurat: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Instansi Penyelenggara</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.instansi}
                onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Jumlah Jam Pelajaran</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={formData.jumlahJam}
                onChange={(e) => setFormData({ ...formData, jumlahJam: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800"
                onClick={handleSubmitForm}
              >
                Simpan
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800"
                onClick={handleCloseModal}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPelatihanKlasikal;
