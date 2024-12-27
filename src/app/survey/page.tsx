"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"; // Bintang penuh
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons"; // Bintang kosong

const Survey: React.FC = () => {
  const [rating, setRating] = useState(0); // Rating 0 - 5
  const [comment, setComment] = useState("");

  // Fungsi untuk menangani klik pada bintang
  const handleStarClick = (index: number) => {
    setRating(index + 1); // Set rating berdasarkan bintang yang diklik
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kirim data survey ke server jika diperlukan
    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();
      if (response.ok) {
        // Setelah survey selesai, arahkan ke halaman logout atau halaman lain
        alert("Survey berhasil dikirim!");
      } else {
        alert("Gagal mengirim survey.");
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat mengirim survey:", err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-lg font-bold mb-4">Gimana nih aplikasi Idamannya, kirim rating dan komentarnya dong</h2>
      <form onSubmit={handleSurveySubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex space-x-2">
            {[...Array(5)].map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={rating > index ? faStar : faRegStar} // Gunakan faStar untuk bintang penuh, faRegStar untuk bintang kosong
                className="cursor-pointer text-yellow-500" // Memberikan warna kuning pada bintang
                onClick={() => handleStarClick(index)} // Ketika bintang diklik, set rating
                size="2x" // Ukuran ikon
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Komentar</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Berikan komentar atau saran..."
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Kirim Survey
        </button>
      </form>
    </div>
  );
};

export default Survey;
