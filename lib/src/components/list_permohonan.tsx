'use client';

// components/Table.tsx

import React from "react";

interface TableProps {
  data: any[];  // Data yang diterima adalah array
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
        <thead>
          <tr className="bg-teal-900 text-white">
            <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Waktu</th>
            <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Nama Pegawai</th>
            <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Nama Editor</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-2 text-gray-500">No data available</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="px-4 py-2 border border-teal-300">{item.last_update}</td>
                <td className="px-4 py-2 border border-teal-300">{item.peg_nama}</td>
                <td className="px-4 py-2 border border-teal-300">{item.editor_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
