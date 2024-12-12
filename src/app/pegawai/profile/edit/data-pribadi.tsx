
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaUpload } from 'react-icons/fa';


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

const Datapribadi = ({ nip }: { nip: string }) => {
  const [profileData, setProfileData] = useState({
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
        rt_ktp: "",
        rw_ktp: "",
        rw: "",
        handphone: "",
        ThnpendidikanAwal: "",
        ThnpendidikanAkhir: "",
        NPWP: "",
        kodepos: "",
        kodeposKTP: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!nip) {
        console.error("NIP tidak ditemukan di parameter URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/pegawai/idaman?peg_nip=${nip}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const data = res.data.data.find((item) => item.peg_nip === nip);

        if (data) {
        setProfileData({
          nip: data.peg_nip || "",
          nipLama: data.peg_nip_lama || "",
          namaLengkap: data.peg_nama || "",
          tempat: data.peg_lahir_tempat || "",
          tanggalLahir: data.peg_lahir_tanggal || "",
          jenisKelamin: data.peg_jenis_kelamin || "",
          statusPernikahan: data.peg_status_perkawinan_nama || "",
          Agama: data.nm_agama || "",
          statusPegawai: data.status_kepegawaian || "",
          TMTcpns: data.peg_cpns_tmt || "",
          TMTpns: data.peg_pns_tmt || "",
          jenisASN: data.nm_agama || "",
          jenisPNS: data.jenis_pns || "",
          pendidikanAwal: data.pend_awal || "",
          ThnpendidikanAwal: data.peg_pend_awal_th || "",
          pendidikanAkhir: data.pend_akhir || "",
          ThnpendidikanAkhir: data.peg_pend_akhir_th || "",
          jenisJabatan: data.nm_agama || "",
          eselon: data.nm_agama || "",
          statusGaji: data.nm_agama || "",
          kedudukanPegawai: data.nm_agama || "",
          namaJabatan: data.jabatan_nama || "",
          satuanKerja: data.satuan_kerja_nama || "",
          golonganAwal: data.gol_awal || "",
          golonganAkhir: data.gol_akhir || "", 
          masaKerjaGolongan: data.nm_agama || "",
          noKARPEG: data.peg_karpeg || "",
          noAskes: data.peg_no_askes || "",
          noKTP: data.peg_ktp || "",
          golonganDarah: data.golongan_darah || "",
          BAPETARUM: data.peg_bapetarum || "",
          NPWP: data.peg_npwp || "",
          TMTGajiBerkalaTerbaru: data.nm_agama || "",
          alamatRumah: data.peg_rumah_alamat || "",
          provinsi: data.nama_provinsi || "",
          kabKota: data.nama_kabkot || "",
          kec: data.nama_kecamatan || "",
          kelDesa: data.nama_kelurahan || "",
          telp: data.peg_telp || "",
          email: data.peg_email || "",
          emailResmi: data.peg_email_resmi || "",
          domisiliKTP: data.peg_domisili_ktp || "",
          alamatRumahKTP: data.peg_rumah_alamat_ktp || "",
          provinsiKTP: data.provinsi_ktp || "",
          kabKotaKTP: data.kabkot_ktp || "",
          kecKTP: data.kecamatan_ktp || "",
          kelDesaKTP: data.kelurahan_ktp || "",
          handphone: data.peg_telp_hp || "",
          rt: data.peg_rumah_rt || "",
          rw: data.peg_rumah_rw || "",
          rt_ktp: data.peg_rumah_rt_ktp || "",
          rw_ktp: data.peg_rumah_rw_ktp || "",
          kodepos: data.peg_kodepos || "",
          kodeposKTP: data.peg_kodepos_ktp || "",
          photoUrl: data.photo_url || "",
        });
    } else {
        console.warn("Data profil tidak ditemukan untuk NIP:", nip);       
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [nip]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
        value: `${profileData.tempat}, ${formatTanggal(profileData.tanggalLahir)}`,
        buttons1: [
            { label: "Akte Kelahiran", icon: <FaUpload /> },    
        ]
    },
    { label: "Jenis Kelamin", value: profileData.jenisKelamin },
    {
        label: "Status Perkawinan",
        value: profileData.statusPernikahan,
        buttons1: [
            { label: "KK", icon: <FaUpload /> },
            { label: "Akte Nikah", icon: <FaUpload /> }
        ]
    },
    { label: "Agama", value: profileData.Agama },
    { label: "Status Pegawai", value: profileData.statusPegawai, 
                label2: "TMT CPNS", value2: formatTanggal(profileData.TMTcpns),
                buttons2: [
                    { label: "SK", icon: <FaUpload /> },
                    { label: "Lamaran", icon: <FaUpload /> },
                    { label: "Nota BKN", icon: <FaUpload /> },
                ],
                label3: "TMT PNS", value3: formatTanggal(profileData.TMTpns),
                buttons3: [             
                    { label: "Prajabatan", icon: <FaUpload /> },
                    { label: "SK", icon: <FaUpload /> },
                ],
    },
    { label: "Jenis ASN", value: profileData.Agama },
    { label: "Jenis PNS", value: profileData.jenisPNS },
    { label: "Pendidikan Awal", value: profileData.pendidikanAwal, label2: "Tahun Pendidikan Awal", value2: profileData.ThnpendidikanAwal },
    { label: "Pendidikan Akhir", value: profileData.pendidikanAkhir, label2: "Tahun Pendidikan Akhir", value2: profileData.ThnpendidikanAkhir },
    { label: "Jenis Jabatan", value: profileData.Agama },
    { label: "Eselon", value: profileData.Agama },
    { label: "Status Gaji", value: profileData.Agama },
    { label: "Kedudukan Pegawai", value: profileData.Agama, label2: "TMT Eselon", value2: profileData.Agama },
    { label: "Nama Jabatan", value: profileData.namaJabatan, label2: "TMT Jabatan", value2: profileData.Agama },
    { label: "Satuan Kerja", value: profileData.satuanKerja, label2: "TMT Unit", value2: profileData.Agama },
    { label: "Golongan Awal", value: profileData.golonganAwal, label2: "TMT Golongan Awal", value2: profileData.Agama },
    { label: "Golongan Akhir", value: profileData.golonganAkhir, label2: "Tahun Golongan Akhir", value2: profileData.Agama },
    { label: "Masa Kerja Golongan", value: profileData.Agama, label2: "Gaji Pokok", value2: profileData.Agama, label3: "No Rekening", value3: profileData.Agama },
    { label: "No KARPEG", value: profileData.noKARPEG, label2: "No Karis/Karsu", value2: profileData.Agama },
    { label: "No Askes", value: profileData.noAskes },
    { label: "No KTP", value: profileData.noKTP, label2: "No. NPWP", value2: profileData.NPWP },
    { label: "Golongan Darah", value: profileData.golonganDarah },
    { label: "BAPETARUM", value: profileData.BAPETARUM },
    { label: "TMT Gaji Berkala Terbaru", value: profileData.Agama },
    { label: "Alamat Rumah", value: profileData.alamatRumah, label2: "RT", value2: profileData.rt, label3: "RW", value3: profileData.rw },
    { label: "Provinsi", value: profileData.provinsi },
    { label: "Kab/Kota", value: profileData.kabKota, label2: "Kode Pos", value2: profileData.kodepos },
    { label: "Kec.", value: profileData.kec },
    { label: "Kel/Desa", value: profileData.kelDesa },
    { label: "Telp", value: profileData.Agama, label2: "HP", value2: profileData.handphone },
    { label: "Email", value: profileData.email },
    { label: "Email Resmi", value: profileData.emailResmi },
    { label: "Domisili KTP", value: profileData.domisiliKTP },
    { label: "Alamat Rumah", value: profileData.Agama, label2: "RT", value2: profileData.rt, label3: "RW", value3: profileData.rw  },
    { label: "Provinsi", value: profileData.provinsiKTP },
    { label: "Kab/Kota", value: profileData.kabKotaKTP, label2: "Kode Pos", value2: profileData.kodeposKTP },
    { label: "Kec.", value: profileData.kecKTP },
    { label: "Kel/Desa", value: profileData.kelDesaKTP },
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


  
const EditProfile = ({ params }: { params: { nip?: string } }) => {
  const nip = params?.nip || "";
  const [activeTab, setActiveTab] = useState<string>(window.location.hash || "#data-pribadi");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash || "#data-pribadi");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (!nip) {
    return <div>Error: NIP tidak ditemukan di URL.</div>;
  }

  return (
    <div>
 

      <div className="tab-content">
        {activeTab === "#data-pribadi" && <Datapribadi nip={nip} />}
        {/* Tambahkan konten tab lainnya di sini */}
      </div>
    </div>
  );
};

export default EditProfile;
