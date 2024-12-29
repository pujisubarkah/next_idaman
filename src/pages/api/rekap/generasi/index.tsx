import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetching data from 'm_spg_satuan_kerja' with nested relation
            const { data: satuanKerjaData, error: satuanKerjaError } = await supabase
                .schema('siap')
                .from('m_spg_satuan_kerja')
                .select(`
                    satuan_kerja_id,
                    satuan_kerja_nama,
                    v_pegawai_data (
                        peg_nama,
                        peg_nip,
                        satuan_kerja_id,
                        unit_kerja_id,
                        satuan_kerja_nama,
                        unit_kerja_parent_nama,
                        unit_kerja_nama,
                        eselon_nm,
                        jabatan_nama,
                        peg_lahir_tanggal,
                        peg_jenis_kelamin
                    )
                `);

            if (satuanKerjaError) {
                return res.status(500).json({ error: `Error fetching 'm_spg_satuan_kerja': ${satuanKerjaError.message}` });
            }

            // Grouping the data by generation based on birth date
            const groupedData = groupByGeneration(satuanKerjaData);

            // Responding with grouped data
            res.status(200).json(groupedData);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    } else {
        // Handle unsupported methods
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Function to group the data by generation based on 'peg_lahir_tanggal'
function groupByGeneration(data) {
    return data.map(satuanKerja => {
        // Ensure 'v_pegawai_data' exists and is an array
        const pegawaiData = satuanKerja.v_pegawai_data || [];

        const groupedPegawai = pegawaiData.reduce((result, pegawai) => {
            const birthDate = pegawai?.peg_lahir_tanggal; // Safely accessing peg_lahir_tanggal
            if (!birthDate) return result; // Skip if no birth date

            const birthYear = new Date(birthDate).getFullYear();

            // Determine the generation based on birth year
            const generation = getGeneration(birthYear);

            // Create a group for each generation if it doesn't exist
            if (!result[generation]) {
                result[generation] = {
                    count: 0, // Initialize count for this generation
                    items: []  // Initialize an array to hold the items for this generation
                };
            }

            // Increment the count for the group
            result[generation].count++;

            // Add the current pegawai to the corresponding generation group
            result[generation].items.push(pegawai); // Push the individual pegawai data

            return result;
        }, {});

        return {
            satuan_kerja_id: satuanKerja.satuan_kerja_id,
            satuan_kerja_nama: satuanKerja.satuan_kerja_nama,
            pegawai_by_generation: groupedPegawai
        };
    });
}

// Function to determine the generation based on birth year
function getGeneration(birthYear) {
    if (birthYear >= 1946 && birthYear <= 1964) return 'Baby Boomers';
    if (birthYear >= 1965 && birthYear <= 1980) return 'Generation X';
    if (birthYear >= 1981 && birthYear <= 1996) return 'Millennials (Generation Y)';
    if (birthYear >= 1997 && birthYear <= 2012) return 'Generation Z';
    if (birthYear >= 2013) return 'Generation Alpha';
    return 'Unknown Generation'; // For those born before 1946 or with unknown birth years
}
