"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Pegawai {

    peg_id: string;
    peg_nama: string;
    unit_kerja_id: string;
    // Add other fields as necessary
}

const EditPegawai: React.FC = () => {
    const [pegawai, setPegawai] = useState<Pegawai | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Added loading state
    const [error, setError] = useState<string | null>(null); // Added error state
    const { id } = useParams<{ id: string }>(); // Accessing dynamic parameter from the URL

    useEffect(() => {
        const fetchPegawai = async () => {
            if (!id) {
                setError("ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`/api/pegawai_unit/${id}`);
                setPegawai(response.data);
            } catch (err) {
                setError('Error fetching data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPegawai();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!pegawai) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <h1>Edit Data Pegawai</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Unit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{pegawai.peg_id}</td>
                        <td>{pegawai.peg_nama}</td>
                        <td>{pegawai.unit_kerja_id}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditPegawai;
