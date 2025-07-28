// src/App.tsx
import {  Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TasksPage from "./pages/TasksPage";
import CompletedTasksPage from "./pages/CompletedTasksPage";
import DeletedTasksPage from "./pages/DeletedTasksPage";
import NewTaskPage from "./pages/NewTaskPage";
import UpdateTaskPage from "./pages/updateTaskPage";
import UserProfilePage from "./pages/UserProfilePage";
//import NotFoundPage from "./pages/NotFoundPage";
import Protected from "./components/Protected";
import Header from "./components/Header"; 


function App() {
  
  return (
    <>
         <Header/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/tasks"
          element={
            <Protected>
              <TasksPage />
            </Protected>
          }
        />
        <Route
          path="/completed-tasks"
          element={
            <Protected><CompletedTasksPage /></Protected>
              
           
          }
        />
        <Route
          path="/deleted"
          element={
            <Protected><DeletedTasksPage /></Protected>
          }
        />
        <Route
          path="/new-task"
          element={
            <Protected><NewTaskPage /></Protected>
              
           
          }
        />
        <Route
          path="/update/:taskId"
          element={
            <Protected><UpdateTaskPage /></Protected>
              
           
          }
        />
        <Route
          path="/profile"
          element={
            <Protected><UserProfilePage /></Protected>
              
           
          }
        />

        
      </Routes>
   </>
  );
}

export default App;
