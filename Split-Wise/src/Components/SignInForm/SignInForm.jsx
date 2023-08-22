import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";

export default function SignInForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formState = {
      email: data.get("email"),
      password: data.get("password"),
    };
    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, formState.email, formState.password)
      .then(async (response) => {
        const user = response.user;
        setSubmitButtonDisabled(false);
        navigate(`/user/${user.uid}`);
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ m: 5 }}>
          Sign In to your Account
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="email"
              id="email"
              label="Email Address"
              type="email"
              required
              fullWidth
              autoFocus
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
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography component="span" variant="body2">
              {" "}
              New to this App ?{" "}
            </Typography>
            <Typography
              variant="body2"
              component={Link}
              to="/user/signup"
              sx={{ color: "#333"}}
            >
              {" "}
              Sign Up
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Typography
        color="error"
        fontWeight="bold"
        variant="body1"
        sx={{ textAlign: "center", mt:2 }}
      >
        {error}
      </Typography>
    </Container>
  );
}
