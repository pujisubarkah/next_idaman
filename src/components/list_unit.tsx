"use client";  
import React, { useState, useEffect } from "react";  
import axios from "axios";  
import { useRouter } from "next/navigation";  
  
interface DataItem {  
  satuan_kerja_nama: string;  
  unit_kerja_nama: string;  
  jumlahPegawai: number;  
  unit_kerja_id: string;  
  unit_kerja_level: number;  
  unit_kerja_parent: string | null;  
  children?: DataItem[];  
}  
  
const ListUnit = () => {  
  const [units, setUnits] = useState<DataItem[]>([]);  
  const [loading, setLoading] = useState(true);  
  const router = useRouter();  
  
  useEffect(() => {  
    const fetchData = async () => {  
      setLoading(true);  
      try {  
        const response = await axios.get("/api/data/unit_kerja");  
        const data = Array.isArray(response.data) ? response.data : [];  
  
        const formatUnitWithEmployeeCount = (unit) => {  
          const currentPegawaiCount = unit.pegawai_count || 0;  
          const formattedChildren = unit.children ? unit.children.map((child) => formatUnitWithEmployeeCount(child)) : [];  
          return {  
            ...unit,  
            jumlahPegawai: currentPegawaiCount,  
            children: formattedChildren,  
          };  
        };  
  
        const formattedUnits = data.flatMap((satuan) =>  
          satuan.units.map((unit) => {  
            const formattedUnit = formatUnitWithEmployeeCount(unit);  
            return {  
              satuan_kerja_nama: satuan.satuan_kerja_nama,  
              unit_kerja_nama: formattedUnit.unit_kerja_nama,  
              jumlahPegawai: formattedUnit.jumlahPegawai,  
              unit_kerja_id: formattedUnit.unit_kerja_id,  
              unit_kerja_level: formattedUnit.unit_kerja_level,  
              unit_kerja_parent: formattedUnit.unit_kerja_parent,  
              children: formattedUnit.children,  
            };  
          })  
        );  
  
        setUnits(formattedUnits);  
      } catch (error) {  
        console.error("Error fetching data:", error.response?.data || error.message);  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    fetchData();  
  }, []);  
  
  const handleSearchClick = (unitKerjaId) => {  
    if (!unitKerjaId) {  
      console.error("unitKerjaId tidak ditemukan");  
      return;  
    }  
    router.push(`/list-pegawai/all/${unitKerjaId}`);  
  };  
  
  const getIndentationStyle = (level: number) => {  
    return {  
      paddingLeft: `${level * 20}px`,  
    };  
  };  
  
  const renderUnits = (unitList: DataItem[]) => {  
    return unitList.map(({ satuan_kerja_nama, unit_kerja_nama, jumlahPegawai, unit_kerja_id, unit_kerja_level, children }, index) => {  
      if (unit_kerja_id === "99") {  
        return null;  
      }  
  
      return (  
        <>  
          <tr key={unit_kerja_id} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>  
            <td className="px-4 py-2 border border-[#f2bd1d]">{satuan_kerja_nama}</td>  
            <td className="px-4 py-2 border border-[#f2bd1d]" style={getIndentationStyle(unit_kerja_level)}>  
              {unit_kerja_nama}  
            </td>  
            <td className="px-4 py-2 border border-[#f2bd1d]">{jumlahPegawai}</td>  
            <td className="px-4 py-2 border border-[#f2bd1d] text-center">  
              <button  
                className="text-[#3781c7] hover:underline"  
                onClick={() => handleSearchClick(unit_kerja_id)}  
              >  
                Lihat Data Pegawai  
              </button>  
            </td>  
          </tr>  
          {children && children.length > 0 && renderUnits(children)}  
        </>  
      );  
    });  
  };  
  
  return (  
    <div className="container mx-auto p-6">  
      <h2 className="text-lg font-semibold mb-4 text-center">List Unit Kerja</h2>  
      <div className="mt-8">  
        {loading ? (  
          <p>Loading data...</p>  
        ) : (  
          <div className="overflow-x-auto">  
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">  
              <thead>  
                <tr className="bg-[#3781c7] text-white">  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Satker</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Unit Kerja</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah Pegawai</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Pilihan</th>  
                </tr>  
              </thead>  
              <tbody>  
                {renderUnits(units)}  
              </tbody>  
            </table>  
          </div>  
        )}  
      </div>  
    </div>  
  );  
};  
  
export default ListUnit;  
