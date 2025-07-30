import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const { user, setUser, logout } = useUserStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
  axiosInstance.get("/api/user").then((res) => {
    setForm(res.data);
    setAvatarUrl(res.data.avatar);
    setUser({
      id: res.data.id,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      email: res.data.email,
      username: res.data.username,
      avatar: res.data.avatar,
    });
  });
}, [setUser]);

  const handleProfileUpdate = async () => {
    try {
      const res = await axiosInstance.patch("/api/user", form);
      setUser(res.data.user);
      alert("Profile updated");
    } catch {
      alert("Failed to update profile");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result as string;

      try {
        const res = await axiosInstance.patch("/api/user/avatar", {
          image: base64,
        });

        
        setAvatarUrl(res.data.avatarUrl);
        setUser({ ...user!, avatar: res.data.avatar });
      } catch (err) {
        console.error(err);
        alert("Failed to upload avatar");
      }
    };

    reader.readAsDataURL(file);
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    try {
      await axiosInstance.patch("/api/user/password", {
        currentPassword,
        newPassword,
      });
      alert("Password updated");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e: any) {
      alert(e.response?.data?.message || "Password update failed");
    }
  };

  const handleLogout = async () => {
    await axiosInstance.post("/api/auth/logout");
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
      <Typography variant="h5" gutterBottom>
        👤 User Profile
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar
          src={avatarUrl}
          sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: 20 }}
        >
          {!avatarUrl &&
            `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`}
        </Avatar>
        <Button variant="outlined" component="label">
          Upload Avatar
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Button>
      </Stack>

      <Stack spacing={2}>
        <TextField
          label="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <TextField
          label="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <TextField
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Button variant="contained" onClick={handleProfileUpdate}>
          Update Profile
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        🔐 Update Password
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Current Password"
          type="password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
        />
        <TextField
          label="New Password"
          type="password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, confirmPassword: e.target.value })
          }
        />
        <Button variant="contained" onClick={handlePasswordUpdate}>
          Update Password
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default UserProfilePage;
