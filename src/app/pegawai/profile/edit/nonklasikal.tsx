"use client";  
import { useState, useEffect } from "react";  
import axios from "axios";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import Select from "react-select"; // Import React Select
import Modal from "react-modal"; // Import Modal

const RiwayatPelatihanNonKlasikal = () => {  
  interface DataPelatihanNonKlasikal {  
    no: number;  
    jenis: string;  
    nama: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    nomorsurat: string;  
    instansi: string;  
    jumlahJam: string;  
  }  
  
  const [data, setData] = useState<DataPelatihanNonKlasikal[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [modalIsOpen, setModalIsOpen] = useState(false);  
  const [formData, setFormData] = useState<DataPelatihanNonKlasikal | null>(null); // State for form data

  // Fungsi untuk memformat tanggal  
  const formatTanggal = (tanggal: string) => {  
    const bulanIndo = [  
      "Januari",  
      "Februari",  
      "Maret",  
      "April",  
      "Mei",  
      "Juni",  
      "Juli",  
      "Agustus",  
      "September",  
      "Oktober",  
      "November",  
      "Desember",  
    ];  
  
    const date = new Date(tanggal);  
    const hari = date.getDate();  
    const bulan = bulanIndo[date.getMonth()];  
    const tahun = date.getFullYear();  
  
    return `${hari} - ${bulan} - ${tahun}`;  
  };  
  
  const fetchRiwayatPelatihanNonKlasikal = async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/pelatihan_non_klasikal?peg_id=${nip}`  
      );  
  
      const mappedData = response.data.map((item: any, index: number) => ({  
        no: index + 1,  
        jenis: item.jenis_pelatihan,  
        nama: item.non_nama,  
        tanggalMulai: formatTanggal(item.non_tgl_mulai),  
        tanggalSelesai: formatTanggal(item.non_tgl_selesai),  
        nomorsurat: item.non_sttp,  
        instansi: item.non_penyelenggara,  
        jumlahJam: item.diklat_jumlah_jam,  
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
      fetchRiwayatPelatihanNonKlasikal(nip);  
    }  
  }, [nip]);  

  // Fungsi untuk membuka modal
  const openModal = (item: DataPelatihanNonKlasikal | null = null) => {
    if (item) {
      setFormData(item);
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
      });
    }
    setModalIsOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalIsOpen(false);
    setFormData(null); // Reset form data
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Fungsi untuk menangani perubahan dropdown
  const handleSelectChange = (selectedOption: any) => {
    if (formData) {
      setFormData({
        ...formData,
        jenis: selectedOption.value,
      });
    }
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData) {
        const url = formData.no === 0 
          ? "/api/riwayat/pelatihan_non_klasikal" 
          : `/api/riwayat/pelatihan_non_klasikal/${formData.no}`; // Assuming you have an endpoint for updating by ID

        const method = formData.no === 0 ? 'POST' : 'PUT';
        const response = await axios({
          method,
          url,
          data: formData,
        });

        if (response.status === 200) {
          closeModal();
          fetchRiwayatPelatihanNonKlasikal(nip!); // Refresh data
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Options for React Select
  const jenisPelatihanOptions = [
    { value: "Coaching", label: "Coaching" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "E-Learning", label: "E-Learning" },
    { value: "Pelatihan Jarak Jauh", label: "Pelatihan Jarak Jauh" },
    { value: "Detasering/Secondment", label: "Detasering/Secondment" },
    { value: "Pembelajaran Alam Terbuka (outbound)", label: "Pembelajaran Alam Terbuka (outbound)" },
    { value: "Patok Banding (benchmarking)", label: "Patok Banding (benchmarking)" },
    { value: "Pertukaran PNS dengan pegawai Swasta/BUMN/BUMD", label: "Pertukaran PNS dengan pegawai Swasta/BUMN/BUMD" },
    { value: "Belajar Mandiri", label: "Belajar Mandiri" },
    { value: "Komunitas Belajar", label: "Komunitas Belajar" },
    { value: "Magang/Praktek Kerja", label: "Magang/Praktek Kerja" },
  ];

  return (  
    <div id="pelatihan-non-klasikal" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Pelatihan Non Klasikal  
      </h3>  
  
      <div className="flex justify-end mb-4">  
        <button  
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
          onClick={() => openModal()} // Open modal for adding new entry
        >  
          <FontAwesomeIcon icon={faPlus} className="inline-block mr-2" /> Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr className="text-sm uppercase">  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">Jenis Pelatihan</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama Pelatihan</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Nomor Sertifikat/Surat Tugas</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi Penyelenggara</th>  
            <th className="p-3 border border-[#f2bd1d]">Jumlah Jam Pelajaran</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={9} className="text-center p-4">  
                Tidak ada data.  
              </td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr  
                key={index}  
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}  
              >  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jenis}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nomorsurat}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button  
                      className="text-green-500 hover:text-green-700"  
                      aria-label="Edit"  
                      onClick={() => openModal(item)} // Pass the item to edit
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

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Tambah/Edit Pelatihan Non Klasikal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="modal-overlay"
        style={{
          content: {
            width: "80%",
            maxWidth: "600px",
            maxHeight: "70vh",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
          },
        }}
      >
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {formData?.no === 0 ? 'Tambah Pelatihan Non Klasikal' : 'Edit Pelatihan Non Klasikal'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Jenis Pelatihan</label>
                <Select
                  options={jenisPelatihanOptions}
                  onChange={handleSelectChange}
                  className="flex-1"
                  placeholder="Pilih Jenis Pelatihan"
                  value={formData ? jenisPelatihanOptions.find(option => option.value === formData.jenis) : null}
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Nama Pelatihan</label>
                <input
                  type="text"
                  name="nama"
                  value={formData?.nama || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Tanggal Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData?.tanggalMulai || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData?.tanggalSelesai || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Nomor Sertifikat/Surat Tugas</label>
                <input
                  type="text"
                  name="nomorsurat"
                  value={formData?.nomorsurat || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Instansi Penyelenggara</label>
                <input
                  type="text"
                  name="instansi"
                  value={formData?.instansi || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium w-1/3">Jumlah Jam</label>
                <input
                  type="number"
                  name="jumlahJam"
                  value={formData?.jumlahJam || ""}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mr-2"
                type="button"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                type="submit"
              >
                {formData?.no === 0 ? 'Tambah' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>  
  );  
};  
  
export default RiwayatPelatihanNonKlasikal;
