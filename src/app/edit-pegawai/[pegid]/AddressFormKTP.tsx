"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

interface AddressFormProps {
    pegawai: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setPegawai: React.Dispatch<React.SetStateAction<any>>;
}

const AddressFormKTP: React.FC<AddressFormProps> = ({ pegawai, handleChange, setPegawai }) => {
    const [dataprovktp, setDataprovktp] = useState<any[]>([]);
    const [datakotaktp, setDatakotaktp] = useState<any[]>([]);
    const [datakecktp, setDatakecktp] = useState<any[]>([]);
    const [dakelktp, setDakelktp] = useState<any[]>([]);

    useEffect(() => {
        getProvinsi();
    }, []);

    const fetchOptions = async (url: string, keyMap: { value: string; label: string }) => {
        try {
            const response = await axios.get(url);
            return response.data.map((item: any) => ({
                value: item[keyMap.value],
                label: item[keyMap.label],
            }));
        } catch (error) {
            console.error(`Failed to fetch data from ${url}:`, error);
            return [];
        }
    };

    const getProvinsi = async () => {
        const options = await fetchOptions("/api/master_data/provinsi", {
            value: "propinsi_id",
            label: "propinsi_nm",
        });
        setDataprovktp(options);
    };

    const getKota = async (idProv: string) => {
        const options = await fetchOptions(`/api/master_data/kabkot?propinsi_id=${idProv}`, {
            value: "kabupaten_id",
            label: "kabupaten_nm",
        });
        setDatakotaktp(options);
    };

    const getKecamatan = async (idKota: string) => {
        const options = await fetchOptions(`/api/master_data/kecamatan?kabupaten_id=${idKota}`, {
            value: "kecamatan_id",
            label: "kecamatan_nm",
        });
        setDatakecktp(options);
    };

    const getKelurahan = async (idKec: string) => {
        const options = await fetchOptions(`/api/master_data/keldes?kecamatan_id=${idKec}`, {
            value: "id",
            label: "nama",
        });
        setDakelktp(options);
    };

    const handleSelectChange = (field: string, value: string | null) => {
        setPegawai((prev: any) => ({ ...prev, [field]: value }));
        if (field === "id_provinsi_ktp") {
            getKota(value || "");
            setDatakotaktp([]);
            setDatakecktp([]);
            setDakelktp([]);
        } else if (field === "id_kota_ktp") {
            getKecamatan(value || "");
            setDatakecktp([]);
            setDakelktp([]);
        } else if (field === "id_kec_ktp") {
            getKelurahan(value || "");
            setDakelktp([]);
        }
    };

    return (
        <>
            {pegawai && (
                <>
                    <div className="mb-4 flex justify-start ml-60">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Provinsi:</label>
                        <Select
                            options={dataprovktp}
                            value={dataprovktp.find((option) => option.value === pegawai.id_provinsi_ktp) || null}
                            onChange={(e) => handleSelectChange("id_provinsi_ktp", e?.value || null)}
                            className="w-2/6 mr-2"
                        />
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>RT:</label>
                        <input
                            id="peg_alamat_rt"
                            name="peg_alamat_rt"
                            type="text"
                            value={pegawai.peg_alamat_rt_ktp || ""}
                            onChange={handleChange}
                            className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>
                    <div className="mb-4 flex justify-start ml-60">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kab/Kota:</label>
                        <Select
                            options={datakotaktp}
                            value={datakotaktp.find((option) => option.value === pegawai.id_kota_ktp) || null}
                            onChange={(e) => handleSelectChange("id_kota_ktp", e?.value || null)}
                            className="w-2/6 mr-2"
                        />
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>RW:</label>
                        <input
                            id="peg_alamat_rw"
                            name="peg_alamat_rw"
                            type="text"
                            value={pegawai.peg_alamat_rw_ktp || ""}
                            onChange={handleChange}
                            className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>
                    <div className="mb-4 flex justify-start ml-60">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kecamatan:</label>
                        <Select
                            options={datakecktp}
                            value={datakecktp.find((option) => option.value === pegawai.id_kec_ktp) || null}
                            onChange={(e) => handleSelectChange("id_kec_ktp", e?.value || null)}
                            className="w-2/6 mr-2"
                        />
                    </div>
                    <div className="mb-4 flex justify-start ml-60">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kelurahan:</label>
                        <Select
                            options={dakelktp}
                            value={dakelktp.find((option) => option.value === pegawai.id_kel_ktp) || null}
                            onChange={(e) => handleSelectChange("id_kel_ktp", e?.value || null)}
                            className="w-2/6 mr-2"
                        />
                        <label className="block text-gray-700 text-sm font-bold w-1/6 pr-8 p-2" style={{ backgroundColor: "#87ceeb" }}>Kode Pos:</label>
                        <input
                            id="peg_kodepos"
                            name="peg_kodepos"
                            type="text"
                            value={pegawai.peg_kodepos_ktp || ""}
                            onChange={handleChange}
                            className="shadow border rounded w-1/6 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default AddressFormKTP;
