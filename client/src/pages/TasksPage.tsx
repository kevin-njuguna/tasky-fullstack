import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";


export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

const IncompleteTasksPage = () => {

const [summary, setSummary] = useState("");
const [isSummarizing, setIsSummarizing] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["incompleteTasks"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tasks/incomplete");
      return response.data as Task[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incompleteTasks"] });
    },
  });

  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(taskId);
    }
  };

  if (isLoading) return <Typography>Loading tasks...</Typography>;
  if (isError)
    return <Typography color="error">Failed to fetch tasks.</Typography>;
  


const handleSummarizeTasks = async () => {
  if (!tasks) return;
  setIsSummarizing(true);

  try {
    const response = await axiosInstance.post("/api/summarize", {
      tasks: tasks.map(({ title, description }) => ({ title, description })),
    });
    setSummary(response.data.summary || "No summary generated.");
  } catch (err) {
    console.error("Failed to summarize tasks:", err);
    setSummary("Something went wrong while summarizing tasks.");
  } finally {
    setIsSummarizing(false);
  }
};


 return (
  <Box sx={{ p: 4 }}>
    <Typography variant="h5" gutterBottom>
      🔄 Your Incomplete Tasks
    </Typography>

    {!tasks || tasks.length === 0 ? (
      <Typography variant="body1" sx={{ mt: 2 }}>
        You don't have any pending tasks. Well done!
      </Typography>
    ) : (
      <>
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid size={{xs:12, sm:6, md:4}} key={task.id}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "#fff7ed",
                  borderLeft: "6px solid #fb923c",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <HourglassEmptyIcon color="warning" />
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {task.description}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Incomplete" color="warning" size="small" />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/update/${task.id}`)}
                    >
                      Update
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

        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSummarizeTasks}
            disabled={isSummarizing}
          >
            {isSummarizing ? "Summarizing..." : "Summarize Tasks"}
          </Button>

          {summary && (
            <Box
              sx={{
                mt: 2,
                backgroundColor: "#f3f4f6",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1">🧠 Task Summary:</Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {summary}
              </Typography>
            </Box>
          )}
        </Box>
      </>
    )}
  </Box>
);

};

export default IncompleteTasksPage;
