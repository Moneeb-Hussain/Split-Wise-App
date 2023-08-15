import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ height: "60vh", paddingLeft:"20px" }}
      >
        <Grid item xs={6}>
          <Typography variant="body1" align="left">
            Experience effortless expense sharing and simplified bill splitting
            with Split Wise. Easily manage group expenses, split bills, and
            foster financial harmony. Join us today for a smarter way to handle
            your shared costs.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
