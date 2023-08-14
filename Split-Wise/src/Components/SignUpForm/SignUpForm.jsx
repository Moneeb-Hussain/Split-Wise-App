import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  ListItemButton,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formState = {
      userName: data.get("userName"),
      email: data.get("email"),
      password: data.get("password"),
    };
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, formState.email, formState.password)
      .then(async (response) => {
        setSubmitButtonDisabled(false);
        const user = response.user;
        await updateProfile(user, {
          displayName: formState.userName,
        });
        navigate("/SignIn");
      })
      .catch((error) => {
        setSubmitButtonDisabled(false);
        setError(error.message);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ m: 5 }}>
          Let's Get Started
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="userName"
              id="userName"
              label="User Name"
              required
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              id="email"
              label="Email Address"
              type="email"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              id="password"
              type="password"
              label="Password"
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          disabled={submitButtonDisabled}
          sx={{ mt: 3, mb: 2 }}
          fullWidth
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
              <Typography 
              component={Link}
              to="/SignIn"
              sx={{ color: "#333"}}
              >
                Already have an account? Sign In
              </Typography>
          </Grid>
        </Grid>
      </Box>
      <Typography
        color="error"
        fontWeight="bold"
        variant="body1"
        sx={{ textAlign: "center" }}
      >
        {error}
      </Typography>
    </Container>
  );
}
