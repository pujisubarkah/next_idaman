"use client";  
  
import React, { useState, useEffect } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faStar } from "@fortawesome/free-solid-svg-icons"; // Full star  
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons"; // Empty star  
  
const Survey: React.FC = () => {  
  const [rating, setRating] = useState(0); // Rating 0 - 5  
  const [question1, setQuestion1] = useState(""); // Response to question 1  
  const [question2, setQuestion2] = useState(""); // Response to question 2  
  const [question3, setQuestion3] = useState(""); // Response to question 3  
  const [ipaddres, setIpAddress] = useState(""); // User's IP address  
  
  // Fetch user's IP address when the component mounts  
  useEffect(() => {  
    const fetchIpAddress = async () => {  
      try {  
        const response = await fetch("https://api.ipify.org?format=json");  
        const data = await response.json();  
        setIpAddress(data.ip); // Set the user's IP address  
      } catch (error) {  
        console.error("Error fetching IP address:", error);  
      }  
    };  
  
    fetchIpAddress();  
  }, []);  
  
  // Function to handle star click  
  const handleStarClick = (index: number) => {  
    setRating(index + 1); // Set rating based on clicked star  
  };  
  
  const handleSurveySubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    
    // Validasi input
    if (rating === 0 || !question1 || !question2 || !question3) {
        alert("Silakan isi semua bagian sebelum mengirim.");
        return;
    }
  
    // Log the survey data before sending  
    const surveyData = {  
        ip_addres: ipaddres, // Include first_ip here  
        rating,  
        question1,  
        question2,  
        question3,  
    };
  
    console.log("Submitting survey with data:", surveyData);  
    
    // Send survey data to the server  
    try {  
        const response = await fetch("/api/survey", {  
            method: "POST",  
            headers: { "Content-Type": "application/json" },  
            body: JSON.stringify(surveyData),  
        });  
    
        const data = await response.json();  
        console.log("Response from server:", data); // Log the server response  
    
        if (response.ok) {  
            alert("Survey berhasil dikirim!");  
        } else {  
            console.error("Error response from server:", data);
            alert("Gagal mengirim survey: " + (data.error || "Unknown error"));  
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
                icon={rating > index ? faStar : faRegStar} // Use faStar for filled star, faRegStar for empty star  
                className="cursor-pointer text-yellow-500" // Yellow color for stars  
                onClick={() => handleStarClick(index)} // Set rating when star is clicked  
                size="2x" // Icon size  
              />  
            ))}  
          </div>  
        </div>  
  
        <div className="mb-4">  
          <label className="block text-sm font-medium mb-2">Bagaimana tampilan idaman sekarang?</label>  
          <textarea  
            value={question1}  
            onChange={(e) => setQuestion1(e.target.value)}  
            className="w-full p-2 border rounded" rows={2}  
            placeholder="Tulis pendapat Anda..."  
          />  
        </div>  
        <div className="mb-4">  
          <label className="block text-sm font-medium mb-2">Apa pendapat anda mengenai kecepatan dalam mengklik laman?</label>  
          <textarea  
            value={question2}  
            onChange={(e) => setQuestion2(e.target.value)}  
            className="w-full p-2 border rounded"  
            rows={2}  
            placeholder="Tulis pendapat Anda..."  
          />  
        </div>  
        <div className="mb-4">  
          <label className="block text-sm font-medium mb-2">Apa masukan anda terhadap idaman ke depannya?</label>  
          <textarea  
            value={question3}  
            onChange={(e) => setQuestion3(e.target.value)}  
            className="w-full p-2 border rounded"  
            rows={2}  
            placeholder="Tulis masukan Anda..."  
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