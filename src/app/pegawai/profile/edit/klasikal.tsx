"use client";  
import { useState, useEffect } from "react";  
import axios from "axios";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import KlasikalModal from "./klasikalmodal"; // Mengimpor modal dari klasikalmodal.tsx  
  
// Interface untuk data pelatihan klasikal  
export interface DataPelatihanKlasikal {  
  no: number;  
  jenis: string;  
  nama: string;  
  tanggalMulai: string;  
  tanggalSelesai: string;  
  nomorsurat: string;  
  instansi: string;  
  jumlahJam: string;  
  isNew?: boolean; // Indikator data baru  
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
  
  const formatTanggal = (tanggal: string) => {  
    const bulanIndo = [  
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",  
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",  
    ];  
  
    const date = new Date(tanggal);  
    const hari = date.getDate();  
    const bulan = bulanIndo[date.getMonth()];  
    const tahun = date.getFullYear();  
  
    return `${hari} ${bulan} ${tahun}`;  
  };  
  
  const fetchRiwayatPelatihanKlasikal = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/pelatihan_klasikal?peg_id=${nip}`);  
      const sortedData = response.data.sort(  
        (a: any, b: any) => new Date(a.non_tgl_mulai).getTime() - new Date(b.non_tgl_mulai).getTime()  
      );  
  
      const mappedData = sortedData.map((item: any, index: number) => ({  
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
      alert("Gagal mengambil data. Silakan coba lagi nanti.");  
    }  
  };  
  
  const handleOpenModal = (item?: DataPelatihanKlasikal) => {  
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
    setModalOpen(true);  
  };  
  
  const handleCloseModal = () => {  
    setModalOpen(false);  
  };  
  
  const validateFormData = (data: DataPelatihanKlasikal) => {  
    if (!data.jenis || !data.nama || !data.tanggalMulai || !data.tanggalSelesai || !data.nomorsurat || !data.instansi || !data.jumlahJam) {  
      alert("Mohon lengkapi semua field.");  
      return false;  
    }  
    return true;  
  };  
    
  const handleSubmitForm = async () => {  
    try {  
      if (!validateFormData(formData)) return;  
    
      if (formData.no === 0) {  
        const newData = { ...formData, isNew: true };  
        await axios.post("/api/riwayat/pelatihan_klasikal", JSON.stringify(newData), {  
          headers: {  
            'Content-Type': 'application/json'  
          }  
        });  
      } else {  
        const editId = formData.no; // Assuming 'no' is the ID for editing  
        await axios.put(`/api/riwayat/pelatihan_klasikal/${formData.no}`, formData);  
      }  
      fetchRiwayatPelatihanKlasikal(nip!);  
      setModalOpen(false);  
    } catch (error) {  
      console.error("Error submitting form:", error);  
      alert("Gagal menyimpan data. Silakan coba lagi.");  
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
    <div id="pelatihan-klasikal" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">Riwayat Pelatihan Klasikal</h3>  
  
      <div className="flex justify-end mb-4">  
        <button  
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
          onClick={() => handleOpenModal()}  
        >  
          <FontAwesomeIcon icon={faPlus} /> Tambah  
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
            <th className="p-3 border border-[#f2bd1d]">Nomor Sertifikat</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi</th>  
            <th className="p-3 border border-[#f2bd1d]">Jumlah Jam</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={9} className="text-center p-4">Tidak ada data.</td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr key={index} className={item.isNew ? "bg-red-200" : (index % 2 === 0 ? "bg-teal-50" : "bg-white")}>  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jenis}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{formatTanggal(item.tanggalMulai)}</td>  
                <td className="p-3 border border-[#f2bd1d]">{formatTanggal(item.tanggalSelesai)}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nomorsurat}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button  
                      className="text-green-500 hover:text-green-700"  
                      onClick={() => handleOpenModal(item)}  
                    >  
                      <FontAwesomeIcon icon={faEdit} /> Edit  
                    </button>  
                    <button  
                      className="text-red-500 hover:text-red-700"  
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
  
      <KlasikalModal  
        isOpen={modalOpen}  
        formData={formData}  
        setFormData={setFormData}  
        handleCloseModal={handleCloseModal}  
        handleSubmitForm={handleSubmitForm}  
      />  
    </div>  
  );  
};  
  
export default RiwayatPelatihanKlasikal;  
