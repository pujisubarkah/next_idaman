import { supabase } from "../../../../lib/supabaseClient"; // Adjust the path as necessary
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, oldPassword, newPassword } = req.body;

  // Validate input
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Fetch user from the database
    const { data: users, error } = await supabase
    .schema("siap_skpd")
      .from("users")
      .select("*")
      .eq("username", username);

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // 2. Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // 3. Validate new password (optional)
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password in the database
    const { error: updateError } = await supabase
    .schema("siap_skpd")
      .from("users")
      .update({ password: hashedPassword })
      .eq("username", username);

    if (updateError) {
      console.error("Update error:", updateError);
      return res.status(500).json({ message: "Failed to update password" });
    }

    // Success
    res.status(200).json({ message: "Password successfully changed" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
