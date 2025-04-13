"use client";

// src/pages/data/jft/TambahJFT.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import RootLayout from '../../../pegawai/profile/edit/layout';
import Select from 'react-select';

const TambahJFT = () => {
  const [formData, setFormData] = useState({
    jf_nama: '',
    rumpun_id: '',
    kategori: '',
    jf_gol_awal_id: '',
    jf_gol_akhir_id: '',
    jf_kode: '',
    jf_bup: '',
    jf_skill: '',
    jf_kelas: '',
    kode_jabatan: ''
  });

  interface Option {
    value: string | number;
    label: string;
  }

  const [golonganOptions, setGolonganOptions] = useState<Option[]>([]);
  const [rumpunOptions, setRumpunOptions] = useState<Option[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<Option[]>([]);
  const [jabatanKelasOptions, setJabatanKelasOptions] = useState<Option[]>([]);
  const skillOptions: Option[] = [
    { value: 'Terampil', label: 'Terampil' },
    { value: 'Ahli', label: 'Ahli' }
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const golonganResponse = await axios.get('/api/master_data/golongan');
        setGolonganOptions(
          golonganResponse.data.map((gol: { gol_id: string; nm_gol: string }) => ({
            value: gol.gol_id,
            label: gol.nm_gol
          }))
        );

        const rumpunResponse = await axios.get('/api/master_data/rumpun_jabatan');
        setRumpunOptions(
          rumpunResponse.data.map((rumpun: { rumpun_id: number; rumpun_nm: string }) => ({
            value: rumpun.rumpun_id,
            label: rumpun.rumpun_nm
          }))
        );

        const kategoriResponse = await axios.get('/api/master_data/kategori_jabatan');
        setKategoriOptions(
          kategoriResponse.data.map((kategori: { jabkat_id: number; jabkat_nm: string }) => ({
            value: kategori.jabkat_id,
            label: kategori.jabkat_nm
          }))
        );

        const jabatanKelasResponse = await axios.get('/api/master_data/jabatan_kelas');
        setJabatanKelasOptions(
          jabatanKelasResponse.data.map((kelas: { kelas: string }) => ({
            value: kelas.kelas,
            label: kelas.kelas
          }))
        );
      } catch (error) {
        console.error('Error fetching options:', error.response?.data || error.message);
      }
    };
    fetchOptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (selectedOption: Option | null, name: string) => {
    setFormData({
      ...formData,
      [name]: selectedOption?.value || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/data/jft', formData);
      alert('Data successfully submitted!');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <RootLayout>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Tambah Jabatan Fungsional Tertentu</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => {
            if (
              key === 'jf_gol_awal_id' ||
              key === 'jf_gol_akhir_id' ||
              key === 'rumpun_id' ||
              key === 'kategori' ||
              key === 'jf_skill' ||
              key === 'jf_kelas'
            ) {
              let options: Option[] = [];
              if (key === 'jf_gol_awal_id' || key === 'jf_gol_akhir_id') options = golonganOptions;
              if (key === 'rumpun_id') options = rumpunOptions;
              if (key === 'kategori') options = kategoriOptions;
              if (key === 'jf_skill') options = skillOptions;
              if (key === 'jf_kelas') options = jabatanKelasOptions;

              return (
                <div className="mb-4 flex items-center" key={key}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 w-1/3"
                    htmlFor={key}
                  >
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  <div className="w-2/3">
                    <Select
                      options={options}
                      onChange={(option) => handleSelectChange(option, key)}
                      placeholder={`Pilih ${key.replace(/_/g, ' ')}`}
                      value={options.find((option) => option.value === formData[key])}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div className="mb-4 flex items-center" key={key}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 w-1/3"
                  htmlFor={key}
                >
                  {key.replace(/_/g, ' ').toUpperCase()}
                </label>
                <input
                  className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={key}
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                />
              </div>
            );
          })}
          <div className="flex justify-end">
            <button
              className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a5a8c]"
              type="submit"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </RootLayout>
  );
};

export default TambahJFT;
