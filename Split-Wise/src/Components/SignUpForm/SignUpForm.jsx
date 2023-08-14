import React from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export default function SignUpForm() {

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        noValidate
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
              label="Username"
              name="Username"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
      </Box>
    </Container>
    )
}
