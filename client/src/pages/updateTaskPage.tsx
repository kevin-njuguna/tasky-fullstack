import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const UpdateTaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  type Task = {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  };

  const { data: task, isLoading, isError } = useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/tasks/${taskId}`);
      return res.data;
    },
    enabled: !!taskId,
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIsCompleted(task.isCompleted);
    }
  }, [task]);

  const updateTaskMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.patch(`/api/tasks/${taskId}`, {
        title,
        description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      navigate("/tasks");
    },
  });

const toggleCompleteMutation = useMutation({
  mutationFn: async () => {
    const endpoint = isCompleted ? `/api/tasks/incomplete/${taskId}` : `/api/tasks/complete/${taskId}`;
    await axiosInstance.patch(endpoint);
  },
  onSuccess: async () => {
  await queryClient.invalidateQueries({ queryKey: ["task", taskId] });
},
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskMutation.mutate();
  };

  const handleToggleComplete = () => {
    toggleCompleteMutation.mutate();
  };

  if (!taskId) {
    return <Typography color="error">Invalid task ID</Typography>;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !task) {
    return (
      <Typography color="error" textAlign="center" mt={5}>
        Failed to load task.
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" textAlign="center" mt={5} mb={3}>
        Update Task
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />

          <Typography variant="body2" color={isCompleted ? "green" : "orange"}>
            Status: {isCompleted ? "Completed" : "Incomplete"}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending ? "Updating..." : "Update Task"}
            </Button>

            <Button
              variant="outlined"
              color={isCompleted ? "warning" : "success"}
              onClick={handleToggleComplete}
              fullWidth
              disabled={toggleCompleteMutation.isPending}
            >
              {toggleCompleteMutation.isPending
                ? "Updating..."
                : isCompleted
                ? "Mark Incomplete"
                : "Mark Complete"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default UpdateTaskPage;
