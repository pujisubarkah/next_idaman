"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface Pegawai {
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan: string | null; // Sesuaikan jika nilai ini bisa `null`
}

const EditPegawai: React.FC = () => {
    const router = useRouter();
    const params = useParams<{ pegid: string }>();
    const pegid = params?.pegid || "";
    const [pegawai, setPegawai] = useState<Pegawai | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!pegid) {
            console.error("ID tidak ditemukan. Mengarahkan pengguna ke halaman utama.");
            setError("ID tidak ditemukan. Anda akan diarahkan ke halaman utama.");
            setTimeout(() => {
                router.push("/edit-pegawai");
            }, 3000);
            return;
        }

        console.log("Fetching data for pegid:", pegid);

        axios
            .get(`/api/pegawai_unit/${pegid}`)
            .then((response) => {
                console.log("Data fetched successfully:", response.data);

                // Ekstrak hanya kolom yang diperlukan
                const { peg_nama, peg_nip, peg_gelar_depan } = response.data;

                setPegawai({
                    peg_nama,
                    peg_nip,
                    peg_gelar_depan,
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error.response || error.message);
                setError("Gagal memuat data pegawai. Silakan coba lagi.");
            });
    }, [pegid]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPegawai((prevState) =>
            prevState ? { ...prevState, [name]: value } : null
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pegawai) {
            console.error("Tidak ada data untuk disimpan.");
            setError("Tidak ada data yang dapat disimpan.");
            return;
        }

        axios
            .put(`/api/pegawai_unit/${pegid}`, pegawai)
            .then((response) => {
                console.log("Data updated successfully:", response.data);
                router.push("/edit-pegawai");
            })
            .catch((error) => {
                console.error("Error updating data:", error.response || error.message);
                setError("Gagal memperbarui data. Silakan coba lagi.");
            });
    };

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <a href="/edit-pegawai">Kembali ke halaman utama</a>
            </div>
        );
    }

    if (!pegawai) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="peg_nama">Nama:</label>
                <input
                    type="text"
                    id="peg_nama"
                    name="peg_nama"
                    value={pegawai.peg_nama || ""} // Tampilkan string kosong jika data null
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="peg_nip">NIP:</label>
                <input
                    type="text"
                    id="peg_nip"
                    name="peg_nip"
                    value={pegawai.peg_nip || ""} // Tampilkan string kosong jika data null
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="peg_gelar_depan">Gelar Depan:</label>
                <input
                    type="text"
                    id="peg_gelar_depan"
                    name="peg_gelar_depan"
                    value={pegawai.peg_gelar_depan || ""} // Tampilkan string kosong jika data null
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default EditPegawai;
