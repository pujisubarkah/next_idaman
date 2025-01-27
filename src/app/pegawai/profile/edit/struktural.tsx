"use client";  
import { useState, useEffect } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
import Modal from "./strukturalModal";  
  
const RiwayatPelatihanStruktural = () => {  
  // Definisi tipe data untuk state  
  interface PelatihanStruktural {  
    no: number;  
    kategori: string;  
    kategoriParent: string;  
    nama: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    jumlahJam: string;  
    nomorSTTP: string;  
    tanggalSTTP: string;  
    jabatanPenandatangan: string;  
    instansi: string;  
    lokasi: string;  
  }  
  
  const [data, setData] = useState<PelatihanStruktural[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);  
  const [selectedData, setSelectedData] = useState<PelatihanStruktural | null>(null);  
  
  // Fungsi untuk memformat tanggal  
  const formatTanggal = (tanggal: string): string => {  
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
  
    return `${hari} ${bulan} ${tahun}`;  
  };  
  
  const fetchRiwayatPelatihan = async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/diklat?diklat_jenis=1&peg_id=${nip}`  
      );  
      const sortedData = response.data.sort(  
        (a: any, b: any) =>  
          new Date(a.diklat_mulai).getTime() - new Date(b.diklat_mulai).getTime()  
      );  
  
      const mappedData: PelatihanStruktural[] = sortedData.map(  
        (item: any, index: number) => ({  
          no: index + 1,  
          kategori: item.diklat_jenis.diklat_jenis_nama,  
          kategoriParent: item.kategori.kategori_parent_nama || "Tidak Ada",  
          nama: item.kategori.kategori_nama,  
          tanggalMulai: formatTanggal(item.diklat_mulai),  
          tanggalSelesai: formatTanggal(item.diklat_selesai),  
          jumlahJam: item.diklat_jumlah_jam,  
          nomorSTTP: item.diklat_sttp_no,  
          tanggalSTTP: formatTanggal(item.diklat_sttp_tgl),  
          jabatanPenandatangan: item.diklat_sttp_pej,  
          instansi: item.diklat_penyelenggara,  
          lokasi: item.diklat_tempat,  
        })  
      );  
  
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
  
    if (nipFromUrl) {  
      fetchRiwayatPelatihan(nipFromUrl);  
    }  
  }, []);  
  
  useEffect(() => {  
    if (nip) {  
      fetchRiwayatPelatihan(nip);  
    }  
  }, [nip]);  
  
  const handleAdd = (newData: PelatihanStruktural) => {  
    axios  
      .post("/api/riwayat/diklat", {  
        ...newData,  
        peg_id: nip,  
        diklat_jenis: 1,  
      })  
      .then(() => {  
        fetchRiwayatPelatihan(nip!);  
        setIsModalOpen(false);  
      })  
      .catch((error) => {  
        console.error("Error adding data:", error);  
      });  
  };  
  
  const handleEdit = (updatedData: PelatihanStruktural) => {  
    axios  
      .put(`/api/riwayat/diklat/${updatedData.no}`, {  
        ...updatedData,  
        peg_id: nip,  
        diklat_jenis: 1,  
      })  
      .then(() => {  
        fetchRiwayatPelatihan(nip!);  
        setIsModalOpen(false);  
      })  
      .catch((error) => {  
        console.error("Error editing data:", error);  
      });  
  };  
  
  const handleDelete = () => {  
    if (selectedData) {  
      axios  
        .delete(`/api/riwayat/diklat/${selectedData.no}`)  
        .then(() => {  
          fetchRiwayatPelatihan(nip!);  
          setIsModalOpen(false);  
        })  
        .catch((error) => {  
          console.error("Error deleting data:", error);  
        });  
    }  
  };  
  
  const openModal = (  
    type: "add" | "edit" | "delete",  
    data: PelatihanStruktural | null = null  
  ) => {  
    setModalType(type);  
    setSelectedData(data);  
    setIsModalOpen(true);  
  };  
  
  return (  
    <div id="pelatihan-struktural" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Pelatihan Struktural  
      </h3>  
  
      <div className="flex justify-end mb-4">  
        <button  
          className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
          onClick={() => openModal("add")}  
        >  
          <FontAwesomeIcon icon={faPlus} /> Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr className="text-sm uppercase">  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">Kategori</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Jumlah Jam</th>  
            <th className="p-3 border border-[#f2bd1d]">No STTP</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal STTP</th>  
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan STTP</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi</th>  
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={12} className="text-center p-4">  
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
                <td className="p-3 border border-[#f2bd1d]">  
                  {item.kategori} ({item.kategoriParent})  
                </td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nomorSTTP}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSTTP}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  {item.jabatanPenandatangan}  
                </td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.lokasi}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
                  <div className="flex space-x-4">  
                    <button  
                      className="text-green-500 hover:text-green-700"  
                      aria-label="Edit"  
                      onClick={() => openModal("edit", item)}  
                    >  
                      <FontAwesomeIcon icon={faEdit} /> Edit  
                    </button>  
                    <button  
                      className="text-red-500 hover:text-red-700"  
                      aria-label="Delete"  
                      onClick={() => openModal("delete", item)}  
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
  
     
    </div>
  );
};
  
export default RiwayatPelatihanStruktural;  

