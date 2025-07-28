import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../store/userStore";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useUser();
  const isMobile = useMediaQuery("(max-width:800px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Tasks", path: "/tasks" },
    { label: "New", path: "/new-task" },
    { label: "Completed", path: "/completed-tasks" },
    { label: "Trash", path: "/deleted" },
    { label: "Profile", path: "/profile" },
  ];

  const renderAvatar = () => {
    if (!user) return null;
    if ((user as any).avatar) {
      // Avatar with image
      return <Avatar alt={user.firstName} src={(user as any).avatar} />;
    } else {
      // Use initials
      const initials =
        `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
      return <Avatar>{initials}</Avatar>;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontFamily: "cursive",
              cursor: "pointer",
            }}
          >
            Tasky
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250 }} role="presentation">
                  <List>
                    {!user ? (
                      <>
                        <ListItem>
                          <ListItemButton component={Link} to="/login">
                            <ListItemText primary="Login" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem>
                          <ListItemButton component={Link} to="/register">
                            <ListItemText primary="Sign Up" />
                          </ListItemButton>
                        </ListItem>
                      </>
                    ) : (
                      <>
                        {navLinks.map((link) => (
                          <ListItemButton
                            key={link.label}
                            component={Link}
                            to={link.path}
                            onClick={() => setDrawerOpen(false)}
                          >
                            <ListItemText primary={link.label} />
                          </ListItemButton>
                        ))}
                        <ListItemButton onClick={handleLogout}>
                          <ListItemText primary="Logout" />
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!user ? (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      color="inherit"
                      component={Link}
                      to={link.path}
                    >
                      {link.label}
                    </Button>
                  ))}
                  <Typography variant="body2" sx={{ mx: 2 }}>
                    Hello, {user.firstName}
                  </Typography>
                  {renderAvatar()}
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
