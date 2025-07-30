import { useState } from "react"; // 
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
  Modal, 
  Fade, 
  Backdrop, 
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SummarizeIcon from '@mui/icons-material/Summarize'; 

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
  const [openSummaryModal, setOpenSummaryModal] = useState(false); 

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

  const handleSummarizeTasks = async () => {
    if (!tasks || tasks.length === 0) {
        setSummary("No incomplete tasks to summarize.");
        setOpenSummaryModal(true); 
        return;
    }
    setIsSummarizing(true);
    setSummary(""); 

    try {
      const response = await axiosInstance.post("/api/summarize", { 
        tasks: tasks.map((task) => ({
          title: task.title,
          description: task.description,
          status: task.isCompleted ? "completed" : "incomplete", 
        })),
      });
      setSummary(response.data.summary || "No summary generated.");
      setOpenSummaryModal(true); 
    } catch (err) {
      console.error("Failed to summarize tasks:", err);
      setSummary("Something went wrong while summarizing tasks.");
      setOpenSummaryModal(true); 
    } finally {
      setIsSummarizing(false);
    }
  };

  if (isLoading) return <Typography>Loading tasks...</Typography>;
  if (isError)
    return <Typography color="error">Failed to fetch tasks.</Typography>;

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

        
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSummarizeTasks}
              disabled={isSummarizing || isLoading || isError} 
              startIcon={<SummarizeIcon />}
            >
              {isSummarizing ? "Summarizing..." : "Summarize Incomplete Tasks"}
            </Button>
          </Box>
        </>
      )}

   
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSummaryModal}
        onClose={() => setOpenSummaryModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openSummaryModal}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '70%', md: '50%' },
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
              🧠 Incomplete Tasks Summary
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2, whiteSpace: "pre-line" }}>
              {summary || "No summary available."}
            </Typography>
            <Button onClick={() => setOpenSummaryModal(false)} sx={{ mt: 3 }} variant="outlined">
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default IncompleteTasksPage;