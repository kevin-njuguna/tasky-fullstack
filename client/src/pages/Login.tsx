import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import useUser from "../store/userStore";

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

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useUser();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/login", {
        identifier,
        password,
      });

      return res.data;
    },
    onError: (err:any) => {
      setFormError(err.response?.data?.message || "Login failed");
    },
    onSuccess: (data) => {
      setUser(data);
      navigate("/tasks");
    },
  });

  const handleLogin = () => {
    setFormError("");
    if (!identifier || !password) {
      setFormError("Please enter your username/email and password.");
      return;
    }
    mutate();
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Grid size={{ xs: 11, sm: 8, md: 5, lg: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Welcome Back
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2}>
              {formError && <Alert severity="error">{formError}</Alert>}

              <TextField
                label="Username or Email"
                fullWidth
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <LoadingButton
                variant="contained"
                fullWidth
                onClick={handleLogin}
                loading={isPending}
              >
                Login
              </LoadingButton>

              <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Register
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
