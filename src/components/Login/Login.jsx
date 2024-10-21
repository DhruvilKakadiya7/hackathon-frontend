import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from "react";
import Link from "@mui/material/Link";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigateTo = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get("email");
    var password = data.get("password");
    // console.log(email);
    try {
      const response = await axios.post("https://lisa-node-backend.onrender.com/auth/login", { email, password })
      if (response.data.status === true) {
        localStorage.clear();
        toast.success("Login Successfully")
        navigateTo('/dashboard')
      }
      else {
        toast.error("invalid credentials")
      }
      // console.log(response.data.status);
    }
    catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: "1.5rem",
            pt: "2rem",
            pb: "3rem",
            borderColor: "grey.600",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="infotext">
            Welcome Back!
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, mb: 3 }}
            className="emailauthclass"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              className="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              className="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="submitbtn"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Typography>
                  {"Don't have an account? "}
                  <Link
                    href="/signup"
                    variant="body2"
                    underline="none"
                    sx={{ fontSize: "16px" }}
                  >
                    {"Sign up"}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};
export default Login;
