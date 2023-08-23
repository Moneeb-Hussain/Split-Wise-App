import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, doc, query, where, getDocs, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { auth,app } from "../../Firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const db = getFirestore(app)
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
    if (formState.password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }  
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, formState.email, formState.password)
      .then(async (response) => {
        setSubmitButtonDisabled(false);
        const user = response.user;
        await updateProfile(user, {
          displayName: formState.userName,
        });
        const userRef = collection(db, "userdata");
        await setDoc(doc(userRef, user.uid), {
          userName: formState.userName,
          email: formState.email,
        });
        navigate(`/user/${user.uid}`);
      })
      .catch((error) => {
        console.log(error.message);
        if(error.message.includes("auth/invalid-email")){
          setError("Invalid Email")
        }
        else if(error.message.includes("auth/email-already-in-use")){
          setError("Email already in use")
        }
        setSubmitButtonDisabled(false);
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
          <Typography component="span" variant="body2"> Already have an account ? </Typography>
              <Typography 
              component={Link}
              to="/user/signin"
              variant="body2"
              sx={{ color: "#333"}}
              >
              Sign In
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
