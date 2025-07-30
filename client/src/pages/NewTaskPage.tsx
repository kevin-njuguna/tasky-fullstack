import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const NewTaskPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setErrorMsg("Both title and description are required.");
      return;
    }

    try {
      await axiosInstance.post("/api/tasks", { title, description });
      setSuccessMsg("Task created successfully!");
      setErrorMsg("");
      setTitle("");
      setDescription("");

      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch {
      setErrorMsg("Failed to create task.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create New Task
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </form>
    </Box>
  );
};

export default NewTaskPage;
