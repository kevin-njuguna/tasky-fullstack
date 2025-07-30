import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axiosInstance from "../api/axios";
import PasswordField from "../components/PasswordField";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/register", {
        firstName,
        lastName,
        username: userName,
        email,
        password,
      });
      return res.data;
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || "Registration failed");
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleRegister = () => {
    setFormError("");

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password ||
      !confirm
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }

    mutate();
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5", mt:1 }}
    >
      <Grid size={{ xs: 11, sm: 8, md: 5, lg: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Create an Account
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2}>
              {formError && <Alert severity="error">{formError}</Alert>}

              <TextField
                label="First Name"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                fullWidth
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                label="Username"
                fullWidth
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                label="Email"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordField
                label="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />

              <LoadingButton
                variant="contained"
                fullWidth
                onClick={handleRegister}
                loading={isPending}
              >
                Sign Up
              </LoadingButton>

              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
