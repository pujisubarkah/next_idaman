import React from 'react';
import RootLayout from '../../pegawai/profile/edit/layout'; // Importing layout from home/layout.js  

const PenghargaanPage: React.FC = () => {
    const data = [
        { id: 1, nama: 'Penghargaan A', tahun: 2020 },
        { id: 2, nama: 'Penghargaan B', tahun: 2021 },
        { id: 3, nama: 'Penghargaan C', tahun: 2022 },
    ];

    return (
        <RootLayout>
            <h1>Daftar Penghargaan</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Penghargaan</th>
                        <th>Tahun</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nama}</td>
                            <td>{item.tahun}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </RootLayout>
    );
};

export default PenghargaanPage;