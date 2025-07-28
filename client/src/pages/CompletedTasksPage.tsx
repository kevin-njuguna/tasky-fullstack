import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

const CompletedTasksPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedTasks"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tasks/completed");
      return response.data as Task[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completedTasks"] });
    },
  });

  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(taskId);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        ✅ Completed Tasks
      </Typography>

      {isLoading && <Typography>Loading completed tasks...</Typography>}
      {isError && (
        <Typography color="error">Failed to fetch completed tasks.</Typography>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No completed tasks yet. Keep going!
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tasks?.map((task) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
            <Card
              variant="outlined"
              sx={{
                borderLeft: "5px solid green",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" sx={{ padding: 0.5 }}>
                    {task.title}
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon fontSize="small" />}
                    label="Completed"
                    color="success"
                    size="small"
                  />
                </Stack>

                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  {task.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/update/${task.id}`)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CompletedTasksPage;
