let pegawaiInaktif = [
    { id: "1", nama: "John Doe", status: "pensiun", tanggal: "2024-11-01" },
    { id: "2", nama: "Jane Smith", status: "meninggal", tanggal: "2024-10-15" },
];

export default async function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(pegawaiInaktif);
    } else if (req.method === 'POST') {
        // Pastikan body dapat dibaca dalam format JSON
        const body = req.body;
        const { nama, status, tanggal } = body;

        if (!nama || !status || !tanggal) {
            return res.status(400).json({ error: 'Semua field harus diisi!' });
        }

        const newPegawai = { id: String(pegawaiInaktif.length + 1), nama, status, tanggal };
        pegawaiInaktif.push(newPegawai);
        return res.status(201).json(newPegawai);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
