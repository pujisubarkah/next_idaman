import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload } from 'react-icons/fa';
import { ADDRGETNETWORKPARAMS } from "dns";

const DataPribadi = () => {
    const [datapribadi, setdatapribadi] = useState({
        nip: "",
        nipLama: "",
        namaLengkap: "",
        tempat: "",
        tanggalLahir: "",
        jenisKelamin: "",
        statusPernikahan: "",
        Agama: "",
        statusPegawai: "",
        jenisASN: "",
        TMTcpns: "",
        TMTpns: "",
        jenisPNS: "",
        pendidikanAwal: "",
        pendidikanAkhir: "",
        jenisJabatan: "",
        eselon: "",
        statusGaji: "",
        kedudukanPegawai: "",
        namaJabatan: "",
        satuanKerja: "",
        golonganAwal: "",
        golonganAkhir: "",
        masaKerjaGolongan: "",
        noKARPEG: "",
        noAskes: "",
        noKTP: "",
        golonganDarah: "",
        BAPETARUM: "",
        TMTGajiBerkalaTerbaru: "",
        alamatRumah: "",
        provinsi: "",
        kabKota: "",
        kec: "",
        kelDesa: "",
        telp: "",
        email: "",
        emailResmi: "",
        domisiliKTP: "",
        alamatRumahKTP: "",
        provinsiKTP: "",
        kabKotaKTP: "",
        kecKTP: "",
        kelDesaKTP: "",
        rt: "",
        rw: "",
        handphone: "",
        ThnpendidikanAwal: "",
        ThnpendidikanAkhir: "",
        NPWP: "",
        kodepos: "",
        kodeposKTP: "",
    });

    // Fungsi untuk memformat tanggal
    const formatTanggal = (tanggal) => {
        const bulanIndo = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const date = new Date(tanggal);
        const hari = date.getDate();
        const bulan = bulanIndo[date.getMonth()];
        const tahun = date.getFullYear();

        return `${hari} - ${bulan} - ${tahun}`;
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User from localStorage:", user);

        if (user && user.username) {
            setdatapribadi(prevData => ({
                ...prevData,
                nip: user.username,
            }));

            const fetchProfileData = async () => {
                try {
                    console.log("Fetching profile data for username:", user.username);
                    const res = await axios.get(`/api/pegawai/idaman?peg_nip=${user.username}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    });

                    const data = res.data.data;
                    const filteredData = data.find(item => item.peg_nip === user.username);

                    if (filteredData) {
                        console.log("Filtered profile data:", filteredData);

                        setdatapribadi(prevData => ({
                            ...prevData,
                            nip: user.username,
                            nipLama: filteredData.peg_nip_lama || "",
                            namaLengkap: filteredData.peg_nama || "",
                            tempat: filteredData.peg_lahir_tempat || "",
                            tanggalLahir: filteredData.peg_lahir_tanggal || "",
                            jenisKelamin: filteredData.peg_jenis_kelamin || "",
                            statusPernikahan: filteredData.peg_status_perkawinan_nama || "",
                            Agama: filteredData.nm_agama || "",
                            statusPegawai: filteredData.status_kepegawaian || "",
                            TMTcpns: filteredData.peg_cpns_tmt || "",
                            TMTpns: filteredData.peg_pns_tmt || "",
                            jenisASN: filteredData.nm_agama || "",
                            jenisPNS: filteredData.jenis_pns || "",
                            pendidikanAwal: filteredData.pend_awal || "",
                            ThnpendidikanAwal: filteredData.peg_pend_awal_th || "",
                            pendidikanAkhir: filteredData.pend_akhir || "",
                            ThnpendidikanAkhir: filteredData.peg_pend_akhir_th || "",
                            jenisJabatan: filteredData.nm_agama || "",
                            eselon: filteredData.nm_agama || "",
                            statusGaji: filteredData.nm_agama || "",
                            kedudukanPegawai: filteredData.nm_agama || "",
                            namaJabatan: filteredData.jabatan_nama || "",
                            satuanKerja: filteredData.satuan_kerja_nama || "",
                            golonganAwal: filteredData.gol_awal || "",
                            golonganAkhir: filteredData.gol_akhir || "", 
                            masaKerjaGolongan: filteredData.nm_agama || "",
                            noKARPEG: filteredData.peg_karpeg || "",
                            noAskes: filteredData.peg_no_askes || "",
                            noKTP: filteredData.peg_ktp || "",
                            golonganDarah: filteredData.golongan_darah || "",
                            BAPETARUM: filteredData.peg_bapetarum || "",
                            NPWP: filteredData.peg_npwp || "",
                            TMTGajiBerkalaTerbaru: filteredData.nm_agama || "",
                            alamatRumah: filteredData.peg_rumah_alamat || "",
                            provinsi: filteredData.nama_provinsi || "",
                            kabKota: filteredData.nama_kabkot || "",
                            kec: filteredData.nama_kecamatan || "",
                            kelDesa: filteredData.nama_kelurahan || "",
                            telp: filteredData.peg_telp || "",
                            email: filteredData.peg_email || "",
                            emailResmi: filteredData.peg_email_resmi || "",
                            domisiliKTP: filteredData.peg_domisili_ktp || "",
                            alamatRumahKTP: filteredData.peg_rumah_alamat_ktp || "",
                            provinsiKTP: filteredData.provinsi_ktp || "",
                            kabKotaKTP: filteredData.kabkot_ktp || "",
                            kecKTP: filteredData.kecamatan_ktp || "",
                            kelDesaKTP: filteredData.kelurahan_ktp || "",
                            handphone: filteredData.peg_telp_hp || "",
                            rt: filteredData.peg_rumah_rt || "",
                            rw: filteredData.peg_rumah_rw || "",
                            rt_ktp: filteredData.peg_rumah_rt_ktp || "",
                            rw_ktp: filteredData.peg_rumah_rw_ktp || "",
                            kodepos: filteredData.peg_kodepos || "",
                            kodeposKTP: filteredData.peg_kodepos_ktp || "",



                        }));
                    } else {
                        console.warn("No matching profile data found for NIP:", user.username);
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    console.error(error.response ? "Error response data:" + error.response.data : error.message);
                }
            };

            fetchProfileData();
        }
    }, []);

    interface DataEntry {
        label: string;
        value: string;
        buttons1?: { label: string; icon: JSX.Element }[];
        buttons2?: { label: string; icon: JSX.Element }[];
        buttons3?: { label: string; icon: JSX.Element }[];
        label2?: string;
        value2?: string;
        label3?: string;
        value3?: string;
    }

    const dataEntries: DataEntry[] = [
        {
            label: "Tempat, Tanggal Lahir",
            value: `${datapribadi.tempat}, ${formatTanggal(datapribadi.tanggalLahir)}`,
            buttons1: [
                { label: "Akte Kelahiran", icon: <FaUpload /> },    
            ]
        },
        { label: "Jenis Kelamin", value: datapribadi.jenisKelamin },
        {
            label: "Status Perkawinan",
            value: datapribadi.statusPernikahan,
            buttons1: [
                { label: "KK", icon: <FaUpload /> },
                { label: "Akte Nikah", icon: <FaUpload /> }
            ]
        },
        { label: "Agama", value: datapribadi.Agama },
        { label: "Status Pegawai", value: datapribadi.statusPegawai, 
                    label2: "TMT CPNS", value2: formatTanggal(datapribadi.TMTcpns),
                    buttons2: [
                        { label: "SK", icon: <FaUpload /> },
                        { label: "Lamaran", icon: <FaUpload /> },
                        { label: "Nota BKN", icon: <FaUpload /> },
                    ],
                    label3: "TMT PNS", value3: formatTanggal(datapribadi.TMTpns),
                    buttons3: [             
                        { label: "Prajabatan", icon: <FaUpload /> },
                        { label: "SK", icon: <FaUpload /> },
                    ],
        },
        { label: "Jenis ASN", value: datapribadi.Agama },
        { label: "Jenis PNS", value: datapribadi.jenisPNS },
        { label: "Pendidikan Awal", value: datapribadi.pendidikanAwal, label2: "Tahun Pendidikan Awal", value2: datapribadi.ThnpendidikanAwal },
        { label: "Pendidikan Akhir", value: datapribadi.pendidikanAkhir, label2: "Tahun Pendidikan Akhir", value2: datapribadi.ThnpendidikanAkhir },
        { label: "Jenis Jabatan", value: datapribadi.Agama },
        { label: "Eselon", value: datapribadi.Agama },
        { label: "Status Gaji", value: datapribadi.Agama },
        { label: "Kedudukan Pegawai", value: datapribadi.Agama, label2: "TMT Eselon", value2: datapribadi.Agama },
        { label: "Nama Jabatan", value: datapribadi.namaJabatan, label2: "TMT Jabatan", value2: datapribadi.Agama },
        { label: "Satuan Kerja", value: datapribadi.satuanKerja, label2: "TMT Unit", value2: datapribadi.Agama },
        { label: "Golongan Awal", value: datapribadi.golonganAwal, label2: "TMT Golongan Awal", value2: datapribadi.Agama },
        { label: "Golongan Akhir", value: datapribadi.golonganAkhir, label2: "Tahun Golongan Akhir", value2: datapribadi.Agama },
        { label: "Masa Kerja Golongan", value: datapribadi.Agama, label2: "Gaji Pokok", value2: datapribadi.Agama, label3: "No Rekening", value3: datapribadi.Agama },
        { label: "No KARPEG", value: datapribadi.noKARPEG, label2: "No Karis/Karsu", value2: datapribadi.Agama },
        { label: "No Askes", value: datapribadi.noAskes },
        { label: "No KTP", value: datapribadi.noKTP, label2: "No. NPWP", value2: datapribadi.NPWP },
        { label: "Golongan Darah", value: datapribadi.golonganDarah },
        { label: "BAPETARUM", value: datapribadi.BAPETARUM },
        { label: "TMT Gaji Berkala Terbaru", value: datapribadi.Agama },
        { label: "Alamat Rumah", value: datapribadi.alamatRumah, label2: "RT", value2: datapribadi.rt, label3: "RW", value3: datapribadi.rw },
        { label: "Provinsi", value: datapribadi.provinsi },
        { label: "Kab/Kota", value: datapribadi.kabKota, label2: "Kode Pos", value2: datapribadi.kodepos },
        { label: "Kec.", value: datapribadi.kec },
        { label: "Kel/Desa", value: datapribadi.kelDesa },
        { label: "Telp", value: datapribadi.Agama, label2: "HP", value2: datapribadi.handphone },
        { label: "Email", value: datapribadi.email },
        { label: "Email Resmi", value: datapribadi.emailResmi },
        { label: "Domisili KTP", value: datapribadi.domisiliKTP },
        { label: "Alamat Rumah", value: datapribadi.Agama, label2: "RT", value2: datapribadi.rt, label3: "RW", value3: datapribadi.rw  },
        { label: "Provinsi", value: datapribadi.provinsiKTP },
        { label: "Kab/Kota", value: datapribadi.kabKotaKTP, label2: "Kode Pos", value2: datapribadi.kodeposKTP },
        { label: "Kec.", value: datapribadi.kecKTP },
        { label: "Kel/Desa", value: datapribadi.kelDesaKTP },
    ];
    
    return (
        <div id="data-pribadi" className="w-full p-2 border rounded-md bg-gray-50">
  <table className="w-full border-collapse border">
    <tbody>
      {dataEntries.map((entry, index) => (
        <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
          
          {/* Label 1 */}
          <td className="px-4 py-2 font-semibold w-1/6">{entry.label}</td>
          <td className="px-4 py-2 w-2/6">
            <div>{entry.value || " "}</div>
            {entry.buttons1 && (
              <div className="mt-2 flex space-x-2">
                {entry.buttons1.map((btn, i) => (
                  <button
                    key={i}
                    className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {btn.icon}
                    <span className="ml-2">{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </td>

          {/* Label 2 */}
          <td className="px-4 py-2 font-semibold w-1/6">{entry.label2}</td>
          <td className="px-4 py-2 w-2/6">
            <div>{entry.value2 || " "}</div>
            {entry.buttons2 && (
              <div className="mt-2 flex space-x-2">
                {entry.buttons2.map((btn, i) => (
                  <button
                    key={i}
                    className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {btn.icon}
                    <span className="ml-2">{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </td>

          {/* Label 3 */}
          <td className="px-4 py-2 font-semibold w-1/6">{entry.label3}</td>
          <td className="px-4 py-2 w-2/6">
            <div>{entry.value3 || " "}</div>
            {entry.buttons3 && (
              <div className="mt-2 flex space-x-2">
                {entry.buttons3.map((btn, i) => (
                  <button
                    key={i}
                    className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {btn.icon}
                    <span className="ml-2">{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

    
    );
    
};

export default DataPribadi;
