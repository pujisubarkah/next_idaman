"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubMenuRiwayatPengembanganOpen, setIsSubMenuRiwayatPengembanganOpen] = useState(false);
    const [isSubMenuRiwayatSDMOpen, setIsSubMenuRiwayatSDMOpen] = useState(false);
    const [isSubMenuKinerjaPrestasiOpen, setIsSubMenuKinerjaPrestasiOpen] = useState(false);
    const [isSubMenuKeluargaOpen, setIsSubMenuKeluargaOpen] = useState(false); // Added state for Keluarga

    return (
        <nav className="bg-teal-500 p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <button
                    className="md:hidden text-white focus:outline-none"
                    aria-label="Toggle navigation"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <i className="fas fa-times"></i>
                    ) : (
                        <i className="fas fa-bars"></i>
                    )}
                </button>
                <div className={`hidden md:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <a href="#" className="text-white hover:bg-teal-600 px-3 py-2 rounded">Data Pribadi</a>
                    <a href="#" className="text-white hover:bg-teal-600 px-3 py-2 rounded">Arsip/Dokumen Digital</a>
                    <div className="relative">
                        <button
                                              className="flex items-center text-white hover:bg-teal-600 px-3 py-2 rounded"
                            onClick={() => setIsSubMenuRiwayatPengembanganOpen(!isSubMenuRiwayatPengembanganOpen)}
                        >
                            Riwayat Pengembangan Kompetensi
                            <FontAwesomeIcon
                                icon={isSubMenuRiwayatPengembanganOpen ? faChevronUp : faChevronDown}
                                className="ml-2"
                            />
                        </button>
                        {isSubMenuRiwayatPengembanganOpen && (
                            <ul className="absolute top-full left-0 bg-teal-600 mt-2 rounded shadow-lg">
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Pendidikan</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Pelatihan Struktural</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Pelatihan Fungsional</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Pelatihan Teknis</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Pelatihan Klasikal Lainnya</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Pelatihan Non Klasikal</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Sertifikat Keahlian/Profesi</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Bahasa</a></li>
                            </ul>
                        )}
                    </div>

                    {/* Menu Riwayat SDM */}
                    <div className="relative">
                        <button
                            className="flex items-center text-white hover:bg-teal-600 px-3 py-2 rounded"
                            onClick={() => setIsSubMenuRiwayatSDMOpen(!isSubMenuRiwayatSDMOpen)}
                        >
                            Riwayat SDM <FontAwesomeIcon
                                icon={isSubMenuRiwayatSDMOpen ? faChevronUp : faChevronDown}
                                className="ml-2"
                            />
                        </button>
                        {isSubMenuRiwayatSDMOpen && (
                            <ul className="absolute top-full left-0 bg-teal-600 mt-2 rounded shadow-lg">
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Jabatan</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat PLT/PLH</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Kepangkatan</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat KGB</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Cuti</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Inaktif</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Kedudukan Hukum</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Kesehatan</a></li>
                            </ul>
                        )}
                    </div>

                    {/* Menu Kinerja dan Prestasi */}
                    <div className="relative">
                        <button
                            className="flex items-center text-white hover:bg-teal-600 px-3 py-2 rounded"
                            onClick={() => setIsSubMenuKinerjaPrestasiOpen(!isSubMenuKinerjaPrestasiOpen)}
                        >
                            Kinerja dan Prestasi
                            <FontAwesomeIcon
                                icon={isSubMenuKinerjaPrestasiOpen ? faChevronUp : faChevronDown}
                                className="ml-2"
                            />
                        </button>
                        {isSubMenuKinerjaPrestasiOpen && (
                            <ul className="absolute top-full left-0 bg-teal-600 mt-2 rounded shadow-lg">
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Sasaran Kerja Pegawai</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Penilaian Angka Kredit</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Penghargaan</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Publikasi</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Keterlibatan Tim Kerja</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Prestasi</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Talent Mapping</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Lihat Hasil Assesmen</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Riwayat Asessmen</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Index Profesional ASN</a></li>
                            </ul>
                        )}
                    </div>

                    {/* Menu Keluarga */}
                    <div className="relative">
                        <button
                            className="flex items-center text-white hover:bg-teal-600 px-3 py-2 rounded"
                            onClick={() => setIsSubMenuKeluargaOpen(!isSubMenuKeluargaOpen)}
                        >
                            Keluarga
                            <FontAwesomeIcon className="ml-2" icon={isSubMenuKeluargaOpen ? faChevronUp : faChevronDown} />
                        </button>
                        {isSubMenuKeluargaOpen && (
                            <ul className="absolute top-full left-0 bg-teal-600 mt-2 rounded shadow-lg">
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Istri</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Anak</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Orang Tua</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Saudara Lainnya</a></li>
                                <li><a href="#" className="block px-4 py-2 text-white hover:bg-teal-700">Kontak Darurat</a></li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;