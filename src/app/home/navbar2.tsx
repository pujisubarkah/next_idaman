import React, { useEffect, useState } from "react";
import axios from "axios"; // Or any other method to make API requests (fetch, etc.)

const ProfileInfo = ({ onUpload }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track if localStorage has been loaded

  // Get the peg_id (username) from localStorage or global state (e.g., context)
  const peg_id = localStorage.getItem("username"); // Replace with your own method of getting the user ID

  useEffect(() => {
    if (peg_id) {
      console.log('Username from localStorage:', peg_id); // Debugging line

      // Make API request to fetch profile data
      axios
        .get(`http://localhost:3000/api/pegawai/idaman_unit${peg_id}`) // Use the correct API endpoint
        .then((response) => {
          const data = response.data;
          console.log('Profile data from API:', data); // Debugging line

          // Mapping fields from API response to desired profile structure
          const formattedData = {
            nip: data.peg_nip,
            nipLama: data.peg_nip_lama,
            namaLengkap: `${data.peg_gelar_depan} ${data.peg_nama} ${data.peg_gelar_belakang}`,
            photoUrl: data.peg_foto ? `https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${data.peg_foto}` : null,
            uploadOptions: data.uploadOptions || [], // Assuming the upload options are part of the response
          };

          setProfileData(formattedData); // Set formatted data
          setLoading(false);
          setIsLoaded(true); // Mark as loaded
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err);
          setError("Failed to load profile data");
          setLoading(false);
          setIsLoaded(true); // Mark as loaded even if there's an error
        });
    } else {
      setError("User not authenticated");
      setLoading(false);
      setIsLoaded(true); // Mark as loaded if username is not found
    }
  }, [peg_id]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Show loading state while checking localStorage and fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error if something went wrong
  }

  return (
    <div className="col-xs-12 col-sm-5">
      <div className="profile-user-info profile-user-info-striped">
        {/* Profile Image and Info */}
        <div className="profile-info-row" style={{ display: "flex", alignItems: "center" }}>
          {/* Foto Placeholder */}
          <div className="profile-info-name" style={{ marginRight: "15px" }}>
            <img
              src={profileData?.photoUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-photo"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* NIP */}
          <div className="profile-info-value">
            <span className="editable" id="nip">{profileData?.nip || 'NIP not available'}</span>
          </div>
        </div>

        {/* Row: NIP Lama */}
        <div className="profile-info-row">
          <div className="profile-info-name">NIP Lama</div>
          <div className="profile-info-value">
            <span className="editable" id="nip_lama">{profileData?.nipLama || 'NIP Lama not available'}</span>
          </div>
        </div>

        {/* Row: Nama Lengkap */}
        <div className="profile-info-row">
          <div className="profile-info-name">Nama Lengkap</div>
          <div className="profile-info-value">
            <span className="editable" id="nama_lengkap">{profileData?.namaLengkap || 'Nama Lengkap not available'}</span>
            <div>
              {/* File upload options */}
              {profileData?.uploadOptions?.map((option) => (
                <span
                  key={option.name}
                  className="label label-danger label-white middle upload-file-btn"
                  style={{ height: "auto", marginTop: "4px", marginBottom: "4px" }}
                >
                  {option.label}
                  <a
                    style={{ cursor: "pointer" }}
                    title="Upload"
                    data-toggle="modal"
                    data-target="#modal-file"
                    onClick={() => onUpload(option)}
                  >
                    <i className="ace-icon fa fa-upload bigger-120"></i>
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-12"></div>
    </div>
  );
};

export default ProfileInfo;
