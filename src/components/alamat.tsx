import React, { useEffect, useState } from 'react';
import Select from 'react-select';

function Halaman() {
  const [dataprov, setDataprov] = useState([]);
  const [datakota, setDatakota] = useState([]);
  const [datakec, setDatakec] = useState([]);
  const [dakel, setDakel] = useState([]);
  const [pegawai, setPegawai] = useState({
    id_provinsi: "",
    id_kota: "",
    id_kec: "",
    id_kel: "",
    peg_kodepos: "",
    peg_telp: "",
    peg_telp_hp: "",
    peg_alamat_rt: "",
    peg_alamat_rw: ""
  });

  useEffect(() => {
    getProvinsi();
  }, []);

  async function getProvinsi() {
    try {
      const response = await fetch("/api/master_data/provinsi");
      const result = await response.json();
      const options = result.map(item => ({
        label: item.propinsi_nm,
        value: item.propinsi_id
      }));
      setDataprov(options);
    } catch (error) {
      console.error("Failed to load provinces:", error);
    }
  }

  async function getKota(idProv) {
    try {
      const response = await fetch(`/api/master_data/kabkot?propinsi_id=${idProv}`);
      const result = await response.json();
      const options = result.map(item => ({
        value: item.kabupaten_id,
        label: item.kabupaten_nm
      }));
      setDatakota(options);
    } catch (error) {
      console.error("Failed to load kabupaten:", error);
    }
  }

  async function getKecamatan(idKota) {
    try {
      const response = await fetch(`/api/master_data/kecamatan?kabupaten_id=${idKota}`);
      const result = await response.json();
      const options = result.map(item => ({
        value: item.kecamatan_id,
        label: item.kecamatan_nm
      }));
      setDatakec(options);
    } catch (error) {
      console.error("Failed to load kecamatan:", error);
    }
  }

  async function getKelurahan(idKec) {
    try {
      const response = await fetch(`/api/master_data/keldes?kecamatan_id=${idKec}`);
      const result = await response.json();
      const options = result.map(item => ({
        value: item.id,
        label: item.nama
      }));
      setDakel(options);
    } catch (error) {
      console.error("Failed to load kelurahan:", error);
    }
  }

  const handleChange = (e) => {
    setPegawai({
      ...pegawai,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Provinsi:</label>
        <Select
          options={dataprov}
          onChange={(e: { value: string }) => {
            e && getKota(e.value);
            setPegawai({ ...pegawai, id_provinsi: e.value });
          }}
        />
      </div>

      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kabupaten:</label>
        <Select
          options={datakota}
          onChange={(e: { value: string }) => {
            e && getKecamatan(e.value);
            setPegawai({ ...pegawai, id_kota: e.value });
          }}
        />
      </div>

      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kecamatan:</label>
        <Select
          options={datakec}
          onChange={(e: { value: string }) => {
            e && getKelurahan(e.value);
            setPegawai({ ...pegawai, id_kec: e.value });
          }}
        />
      </div>

      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/ 6 pr-8 bg-teal-100 p-2">Kelurahan:</label>
        <Select
          options={dakel}
          onChange={(e: { value: string }) => e && setPegawai({ ...pegawai, id_kel: e.value })}
        />
      </div>

      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">RT:</label>
        <input
          id="peg_alamat_rt"
          name="peg_alamat_rt"
          type="text"
          value={pegawai.peg_alamat_rt || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
        />
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">RW:</label>
        <input
          id="peg_alamat_rw"
          name="peg_alamat_rw"
          type="text"
          value={pegawai.peg_alamat_rw || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>

      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Kode Pos:</label>
        <input
          id="peg_kodepos"
          name="peg_kodepos"
          type="text"
          value={pegawai.peg_kodepos || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300 mr-2"
        />
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">Telp:</label>
        <input
          id="peg_telp"
          name="peg_telp"
          type="text"
          value={pegawai.peg_telp || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>

      <div className="mb-4 flex justify-start ml-60">
        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 bg-teal-100 p-2">HP:</label>
        <input
          id="peg_telp_hp"
          name="peg_telp_hp"
          type="text"
          value={pegawai.peg_telp_hp || ""}
          onChange={handleChange}
          className="shadow border rounded w-2/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
        />
      </div>
    </div>
  );
}

export default Halaman;