import { useEffect } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";

const LandingPage = () => {

const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    logout(); 
  }, [logout]);
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #222, #764ba2ff)",
        color: "white",
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{xs:12, md:6}} >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                fontWeight={800}
                gutterBottom
                sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
              >
                Welcome to Tasky
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.25rem" }, opacity: 0.9 }}
              >
                Organize your day, stay focused, and manage your tasks with ease.
              </Typography>
              <Box mt={4}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#fff",
                    color: "#764ba2",
                    fontWeight: 600,
                    px: 4,
                    "&:hover": {
                      backgroundColor: "#f0eaff",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    ml: 2,
                    borderColor: "#fff",
                    color: "#fff",
                    fontWeight: 600,
                    px: 4,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <motion.img
              src="/hour glass.jpeg"
              alt="Tasky image"
              style={{
                width: "70%",
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
