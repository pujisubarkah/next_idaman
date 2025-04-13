"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faDownload, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ProfileEditButtons from './button'; // Sesuaikan dengan path file ProfileEditButtons  

const ListDocuments = () => {
  interface Document {
    id: number;
    namaFile: string;
    fileUrl: string | null;
    keterangan: string;
    tanggalUpload: string;
  }

  const [documentCategories, setDocumentCategories] = useState<{
    category: string;
    documents: Document[];
  }[]>([]);

  const [nip, setNip] = useState<string | null>(null);

  const formatTanggal = (tanggal: string | null) => {
    if (!tanggal) return "";

    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return "";

    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} - ${bulan} - ${tahun}`;
  };

  useEffect(() => {
    const path = window.location?.pathname || "";
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1] || "";
    setNip(nipFromUrl);

    if (nipFromUrl) {
      fetchfilepegawai(nipFromUrl);
    }
  }, []);

  const fetchfilepegawai = async (nip: string) => {
    try {
      const response = await axios.get(`/api/file_pegawai?peg_id=${nip}`);
      const sortedData = response.data;

      const mappedData = sortedData.map((item: any) => ({
        category: item.category_name,
        documents: item.documents || [],
      }));

      setDocumentCategories(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewFile = (nip: string, fileUrl: string) => {
    const fullUrl = `https://idaman.lan.go.id/uploads/file/${nip}/${fileUrl}`;
    window.open(fullUrl, "_blank");
  };

  const handleDownloadFile = (fileUrl: string | null) => {
    if (fileUrl) {
      const downloadUrl = `https://idaman.lan.go.id/uploads/file/${encodeURIComponent(fileUrl.split("/").slice(-2).join("/"))}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileUrl.split("/").pop()!;
      link.click();
    } else {
      alert("File tidak tersedia.");
    }
  };

  const handleDeleteFile = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus file ini?")) {
      alert(`Menghapus file dengan ID: ${id}`);
    }
  };

  const handleEditFile = (id: number) => alert(`Edit file dengan ID: ${id}`);

  return (
    <div id="file-pegawai" className="p-4">
      <h2 className="text-center text-xl font-semibold my-4">ARSIP/DOKUMEN DIGITAL</h2>

      {documentCategories.map(({ category, documents }) => (
        <div key={category} className="mb-8">
          <h3 className="text-left text-xl font-semibold my-2">{category}</h3>
          <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">
            <thead className="bg-[#3781c7]">
              <tr className="bg-[#3781c7] text-white">
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">No</th>
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama File</th>
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">File</th>
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Keterangan</th>
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Tanggal Upload</th>
                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Pilihan</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">Tidak ada dokumen ditemukan.</td>
                </tr>
              ) : (
                documents.map((doc, index) => (
                  <tr key={doc.id} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                    <td className="p-3 border border-[#f2bd1d]">{index + 1}</td>
                    <td className="p-3 border border-[#f2bd1d]">{doc.namaFile}</td>
                    <td className="p-3 border border-[#f2bd1d]">
                      <a
                        href={doc.fileUrl ? `https://idaman.lan.go.id/uploads/file/${encodeURIComponent(doc.fileUrl.split("/").slice(-2).join("/"))}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={doc.fileUrl ? "text-blue-600 hover:underline" : "text-gray-400 cursor-not-allowed"}
                      >
                        {doc.fileUrl ? doc.fileUrl.split("/").pop() : "File tidak tersedia"}
                      </a>
                    </td>
                    <td className="p-3 border border-[#f2bd1d]">{doc.keterangan}</td>
                    <td className="p-3 border border-[#f2bd1d]">{formatTanggal(doc.tanggalUpload)}</td>
                    <td className="p-3 border border-[#f2bd1d]">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewFile(nip!, doc.fileUrl!)}
                          className="text-blue-500 hover:text-blue-700"
                          aria-label="Lihat File"
                        >
                          <FontAwesomeIcon icon={faEye} /> Lihat
                        </button>
                        <button
                          onClick={() => handleDownloadFile(doc.fileUrl)}
                          className="text-green-500 hover:text-green-700"
                          aria-label="Download"
                        >
                          <FontAwesomeIcon icon={faDownload} /> Download
                        </button>
                        <button
                          onClick={() => handleDeleteFile(doc.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Hapus
                        </button>
                        <button
                          onClick={() => handleEditFile(doc.id)}
                          className="text-yellow-500 hover:text-yellow-700"
                          aria-label="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ListDocuments;
