import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #667eea, #764ba2)",
        color: "white",
        py: 10,
      }}
    >
      <Container>
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" fontWeight={700} gutterBottom>
                Welcome to Tasky
              </Typography>
              <Typography variant="h6" gutterBottom>
                Organize your day, stay focused, and manage your tasks with
                ease.
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
                    mr: 2,
                    fontWeight: 600,
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: "#fff", color: "white", fontWeight: 600 }}
                >
                  Login
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.img
              src="/assets/react.svg"
              alt="Tasky Illustration"
              style={{
                width: "100%",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
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
