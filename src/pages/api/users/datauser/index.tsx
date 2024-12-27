import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch users with their role information
            type User = {
                username: any;
                role_id: any;
                satuan_kerja_id: any;
                email: any;
                nama: any;
                role: any[];
                satuan_kerja_nama?: string | null;
            };

            const { data: users, error } = await supabase
                .schema('siap_skpd') // Ensure schema is correct
                .from('users')
                .select(`
                    username, role_id, satuan_kerja_id, email, nama,
                    role:role_id (*)
                `);

            if (error) {
                throw new Error(error.message);
            }

            // Fetch related satuan_kerja_nama from m_spg_satuan_kerja table
            const satuanKerjaIds = users.map(user => user.satuan_kerja_id).filter(Boolean);
            const { data: satuanKerjaData, error: satuanKerjaError } = await supabase
                .schema('siap')
                .from('m_spg_satuan_kerja')
                .select('satuan_kerja_id, satuan_kerja_nama')
                .in('satuan_kerja_id', satuanKerjaIds);

            if (satuanKerjaError) {
                throw new Error(satuanKerjaError.message);
            }

            // Map satuan_kerja_nama to users
            const satuanKerjaMap = satuanKerjaData.reduce((acc, curr) => {
                acc[curr.satuan_kerja_id] = curr.satuan_kerja_nama;
                return acc;
            }, {});

            users.forEach(user => {
                (user as User).satuan_kerja_nama = satuanKerjaMap[user.satuan_kerja_id] || null;
            });

            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            // Validate POST request body
            const { name, email, role_id } = req.body;

            if (!name || !email || !role_id) {
                return res.status(400).json({ error: 'Name, email, and role_id are required.' });
            }

            // Create a new user
            const { data, error } = await supabase
                .from('users')
                .insert([{ name, email, role_id }]);

            if (error) {
                throw new Error(error.message);
            }

            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
