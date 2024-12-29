import React from 'react';

const PresensiUser: React.FC = () => {
    const [presensi, setPresensi] = React.useState<string[]>([]);

    const handlePresensi = () => {
        const currentTime = new Date().toLocaleTimeString();
        setPresensi([...presensi, currentTime]);
    };

    return (
        <div>
            <h1>Presensi User</h1>
            <button onClick={handlePresensi}>Presensi</button>
            <ul>
                {presensi.map((time, index) => (
                    <li key={index}>{time}</li>
                ))}
            </ul>
        </div>
    );
};

export default PresensiUser;