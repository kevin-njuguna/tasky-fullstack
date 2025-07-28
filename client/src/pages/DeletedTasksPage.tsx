import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,
  Container,
  Divider,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Define a proper Task type
interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
}

const DeletedTasksPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["deletedTasks"],
    queryFn: async () => {
      const res = await axios.get("/api/tasks/deleted", {
        withCredentials: true,
      });
      console.log("Deleted tasks fetched from backend:", res.data);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (taskId: string) =>
      axios.patch(`/api/tasks/restore/${taskId}`, null, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedTasks"] });
    },
  });

  const tasks = data ?? [];

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Deleted Tasks
      </Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {error && (
        <Typography color="error">Failed to load deleted tasks.</Typography>
      )}

      {tasks.length === 0 && !isLoading ? (
        <Stack alignItems="center" mt={6} spacing={1}>
          <HourglassDisabledIcon fontSize="large" color="disabled" />
          <Typography color="text.secondary">Trash is empty</Typography>
        </Stack>
      ) : (
        <Stack spacing={3} mt={3}>
          {tasks.map((task: Task) => (
            <Card
              key={task.id}
              variant="outlined"
              sx={{
                backgroundColor: "#fefefe",
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Box>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => restoreMutation.mutate(task.id)}
                      color="primary"
                    >
                      <RestoreIcon />
                    </IconButton>
                    <IconButton disabled color="error">
                      <DeleteForeverIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default DeletedTasksPage;
