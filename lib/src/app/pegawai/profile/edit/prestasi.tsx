'use client';
import React, { useEffect, useState } from "react";
import PrestasiKelompok from "./prestasi_kelompok";
import PrestasiPribadi from "./prestasi_pribadi";

const Riwayatprestasi: React.FC = () => {
  const [nip, setNip] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);
  }, []);

  return (
    <div id="prestasi" className="p-4">
      {nip && <PrestasiKelompok nip={nip} />}
      {nip && <PrestasiPribadi nip={nip} />}
    </div>
  );
};

export default Riwayatprestasi;
