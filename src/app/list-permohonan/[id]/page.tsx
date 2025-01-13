"use client";

import { useEffect, useState } from "react";
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import Table from "../../../components/list_permohonan"; // Mengimpor komponen Table

const ListPermohonan = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null); // State to hold the unwrapped id
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pemetaan status_id ke status_name
  const statusMapping: { [key: string]: string } = {
    "1": "Draft",
    "2": "Usul Perubahan",
    "3": "Revisi",
    "4": "Sudah Verifikasi SDM",
    "5": "Usul Perubahan (Pegawai Unit Kerja)",
    "6": "Revisi Perubahan (Pegawai Unit Kerja)",
  };

  // Tentukan status_name berdasarkan id
  const statusName = statusMapping[id || ""] || "Unknown Status";

  // Pagination state
  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params; // Unwrap the params Promise
      setId(resolvedParams.id); // Set the id state
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
          const response = await fetch(`/api/permohonan?status_id=${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setData(result); // Simpan seluruh data dari API
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  // Handle page changes
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <RootLayout>
      <div className="flex-4 h-full px-4 overflow-auto">
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold font-poppins">
            DAFTAR PEMOHON DENGAN STATUS {statusName}
          </h3>
          <hr className="my-4 border-gray-300" />

          {/* Table Component */}
          <Table data={paginatedData} />

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </RootLayout>
  );
};

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-300 rounded"
      >
        Previous
      </button>
      <span className="px-4 py -2 mx-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-gray-300 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default ListPermohonan;