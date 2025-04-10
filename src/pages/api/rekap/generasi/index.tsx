import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ambil data satuan kerja beserta relasi v_pegawai_data
      const satuanKerjaData = await prisma.m_spg_satuan_kerja.findMany({
        include: {
          pegawai: {
            select: {
              peg_nama: true,
              peg_nip: true,
              satuan_kerja_id: true,
              unit_kerja_id: true,
              satuan_kerja_nama: true,
              unit_kerja_parent_nama: true,
              unit_kerja_nama: true,
              eselon_nm: true,
              jabatan_nama: true,
              peg_lahir_tanggal: true,
              peg_jenis_kelamin: true,
            },
          },
        },
      });

      // Group by generasi berdasarkan tanggal lahir
      const groupedData = groupByGeneration(satuanKerjaData);

      res.status(200).json(groupedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function groupByGeneration(data) {
  return data.map((satuanKerja) => {
    const pegawaiData = satuanKerja.pegawai || [];

    const groupedPegawai = pegawaiData.reduce((result, pegawai) => {
      const birthDate = pegawai?.peg_lahir_tanggal;
      if (!birthDate) return result;

      const birthYear = new Date(birthDate).getFullYear();
      const generation = getGeneration(birthYear);

      if (!result[generation]) {
        result[generation] = {
          count: 0,
          items: [],
        };
      }

      result[generation].count++;
      result[generation].items.push(pegawai);

      return result;
    }, {});

    return {
      satuan_kerja_id: satuanKerja.satuan_kerja_id,
      satuan_kerja_nama: satuanKerja.satuan_kerja_nama,
      pegawai_by_generation: groupedPegawai,
    };
  });
}

function getGeneration(birthYear) {
  if (birthYear >= 1946 && birthYear <= 1964) return 'Baby Boomers';
  if (birthYear >= 1965 && birthYear <= 1980) return 'Generation X';
  if (birthYear >= 1981 && birthYear <= 1996) return 'Millennials (Generation Y)';
  if (birthYear >= 1997 && birthYear <= 2012) return 'Generation Z';
  if (birthYear >= 2013) return 'Generation Alpha';
  return 'Unknown Generation';
}
