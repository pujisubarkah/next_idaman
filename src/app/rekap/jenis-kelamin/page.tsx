"use client";  
  
import React, { useEffect, useState } from "react";  
import RootLayout from "../../pegawai/profile/edit/layout";  
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner"; // Adjust the path as necessary
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons";  
  
interface RekapGolonganData {  
  no: number;  
  satker: string;  
  lakiLaki: number;  
  perempuan: number;  
  jumlahSeluruh: number;  
  detailLakiLaki: PegawaiDetail[];  
  detailPerempuan: PegawaiDetail[];  
}  
  
interface PegawaiDetail {  
  peg_nip: string;  
  peg_nama: string;  
  jabatan_nama: string | null;  
  unit_kerja_nama: string;  
  satuan_kerja_nama: string;  
  unit_kerja_parent_nama?: string; // Assuming this field might be optional  
}  
  
const RekapJenisKelamin: React.FC = () => {  
  const [data, setData] = useState<RekapGolonganData[]>([]); // State to store the data  
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator  
  const [isModalOpen, setModalOpen] = useState<boolean>(false); // State for modal open  
  const [pegawaiDetails, setPegawaiDetails] = useState<PegawaiDetail[]>([]); // State for pegawai details  
  
  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        const response = await axios.get("/api/rekap/jeniskelamin");  
        const apiData = response.data;  
  
        // Transform API data  
        const transformedData: RekapGolonganData[] = apiData.map(  
          (item: any, index: number) => ({  
            no: index + 1,  
            satker: item.satuan_kerja_nama,  
            lakiLaki: item.pegawai_by_gender?.L?.count || 0,  
            perempuan: item.pegawai_by_gender?.P?.count || 0,  
            jumlahSeluruh:  
              (item.pegawai_by_gender?.L?.count || 0) +  
              (item.pegawai_by_gender?.P?.count || 0),  
            detailLakiLaki: item.pegawai_by_gender?.L?.pegawai || [],  
            detailPerempuan: item.pegawai_by_gender?.P?.pegawai || [],  
          })  
        );  
        setData(transformedData);  
      } catch (error) {  
        console.error("Error fetching data:", error);  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    fetchData();  
  }, []);  
  
  // Calculate totals for each golongan  
  const totalLakiLaki = data.reduce((total, item) => total + item.lakiLaki, 0);  
  const totalPerempuan = data.reduce((total, item) => total + item.perempuan, 0);  
  const totalJumlahSeluruh = data.reduce(  
    (total, item) => total + item.jumlahSeluruh,  
    0  
  );  
  
  // Open modal and set pegawai details  
  const handleOpenModal = (details: PegawaiDetail[]) => {  
    setPegawaiDetails(details);  
    setModalOpen(true);  
  };  
  
  return (  
    <RootLayout>  
      <div className="my-5">  
        <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">  
          REKAPITULASI APARATUR SIPIL NEGARA  
        </h1>  
        <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">  
          DI LINGKUNGAN LEMBAGA ADMINISTRASI NEGARA  
        </h1>  
  
        <div className="overflow-x-auto">  
          {loading ? (  
            <div className="flex justify-center items-center">  
              <LoadingSpinner />  
            </div>  
          ) : (  
            <table className="w-full border border-[#3781c7] rounded-lg">  
              <thead>  
                <tr className="bg-[#3781c7] text-white">  
                  <th className="p-3 border border-[#f2bd1d] text-center" rowSpan={2}>  
                    No  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-center" rowSpan={2}>  
                    Nama Satker  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-center" colSpan={2}>  
                    Jenis Kelamin  
                  </th>  
                  <th className="p-3 border border-[#f2bd1d] text-center" rowSpan={2}>  
                    Jumlah Seluruh  
                  </th>  
                </tr>  
                <tr className="bg-[#3781c7] text-white">  
                  <th className="p-2 border border-[#f2bd1d] text-center">Laki-laki</th>  
                  <th className="p-2 border border-[#f2bd1d] text-center">Perempuan</th>  
                </tr>  
              </thead>  
              <tbody>  
                {data.length === 0 ? (  
                  <tr>  
                    <td colSpan={5} className="p-3 text-center text-gray-500">  
                      No data available.  
                    </td>  
                  </tr>  
                ) : (  
                  data.map((item) => (  
                    <tr key={item.no} className="bg-teal-50 hover:bg-teal-100">  
                      <td className="p-3 border border-[#f2bd1d] text-center">  
                        {item.no}  
                      </td>  
                      <td className="p-3 border border-[#f2bd1d]">{item.satker}</td>  
                      <td  
                        className="p-3 border border-[#f2bd1d] text-center text-blue-600 cursor-pointer"  
                        onClick={() => handleOpenModal(item.detailLakiLaki)}  
                      >  
                        {item.lakiLaki}  
                      </td>  
                      <td  
                        className="p-3 border border-[#f2bd1d] text-center text-blue-600 cursor-pointer"  
                        onClick={() => handleOpenModal(item.detailPerempuan)}  
                      >  
                        {item.perempuan}  
                      </td>  
                      <td className="p-3 border border-[#f2bd1d] text-center">  
                        {item.jumlahSeluruh}  
                      </td>  
                    </tr>  
                  ))  
                )}  
              </tbody>  
              <tfoot>  
                <tr className="bg-[#87ceeb] text-white">  
                  <td colSpan={2} className="p-3 border border-[#f2bd1d] text-center font-bold">  
                    Total  
                  </td>  
                  <td className="p-3 border border-[#f2bd1d] text-center font-bold">  
                    {totalLakiLaki}  
                  </td>  
                  <td className="p-3 border border-[#f2bd1d] text-center font-bold">  
                    {totalPerempuan}  
                  </td>  
                  <td className="p-3 border border-[#f2bd1d] text-center font-bold">  
                    {totalJumlahSeluruh}  
                  </td>  
                </tr>  
              </tfoot>  
            </table>  
          )}  
        </div>  
      </div>  
  
      {/* Modal for Detail Pegawai */}  
      {isModalOpen && (  
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">  
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%]">  
            <h2 className="text-lg font-bold mb-4">Detail Pegawai</h2>  
            <div className="overflow-y-auto max-h-[400px]">  
              <table className="w-full border border-gray-300">  
                <thead>  
                  <tr className="bg-gray-100">  
                    <th className="p-2 border border-gray-300 text-left">Nama</th>  
                    <th className="p-2 border border-gray-300 text-left">NIP</th>  
                    <th className="p-2 border border-gray-300 text-left">Satuan Kerja</th>  
                    <th className="p-2 border border-gray-300 text-left">Unit Kerja Parent</th>  
                    <th className="p-2 border border-gray-300 text-left">Unit Kerja</th>  
                    <th className="p-2 border border-gray-300 text-left">Jabatan</th>  
                    <th className="p-2 border border-gray-300 text-left">Pilihan</th>  
                  </tr>  
                </thead>  
                <tbody>  
                  {pegawaiDetails.map(({ peg_nip, peg_nama, satuan_kerja_nama, unit_kerja_parent_nama, unit_kerja_nama, jabatan_nama }, index) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>  
                      <td className="p-2 border border-gray-300">{peg_nama}</td>  
                      <td className="p-2 border border-gray-300">{peg_nip}</td>  
                      <td className="p-2 border border-gray-300">{satuan_kerja_nama}</td>  
                      <td className="p-2 border border-gray-300">{unit_kerja_parent_nama}</td>  
                      <td className="p-2 border border-gray-300">{unit_kerja_nama}</td>  
                      <td className="p-2 border border-gray-300">{jabatan_nama}</td>  
                      <td className="p-2 border border-gray-300">  
                        <div className="flex gap-x-2">  
                          <button  
                            className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a5a8c] flex items-center"  
                            onClick={() => window.open(`/pegawai/profile/edit/${peg_nip}`, "_blank")}  
                          >  
                            <FontAwesomeIcon icon={faEye} className="mr-2" />  
                            View  
                          </button>  
                          <button  
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"  
                            onClick={() => window.open(`/edit-pegawai/${peg_nip}`, "_blank")}  
                          >  
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />  
                            Edit  
                          </button>  
                        </div>  
                      </td>  
                    </tr>  
                  ))}  
                </tbody>  
              </table>  
              <button  
                className="mt-5 px-4 py-2 bg-red-500 text-white rounded"  
                onClick={() => setModalOpen(false)}  
              >  
                Close  
              </button>  
            </div>  
          </div>  
        </div>  
      )}  
    </RootLayout>  
  );  
};  
  
export default RekapJenisKelamin;  
