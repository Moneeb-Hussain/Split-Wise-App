import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SplitImage from "../../assets/expenseSplit.jpg";

export default function Home() {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: "20px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          sm={6}
          display="flex"
          flexDirection="Column"
          justifyContent="center"
        >
          <Typography
            variant="body1"
            align="left"
            sx={{
              width: { sm: "80%" },
              fontSize: { xs: "1rem", sm: "1.25rem" },
              paddingLeft: { sm: "30px" },
              paddingTop: { sm: "0" },
              lineHeight: { sm: "33px" },
            }}
          >
            Experience effortless expense sharing and simplified bill splitting
            with Split Wise. Easily manage group expenses, split bills, and
            foster financial harmony. Join us today for a smarter way to handle
            your shared costs.
          </Typography>
          <Typography
            variant="body1"
            align="left"
            sx={{
              width: { sm: "80%" },
              fontSize: { xs: "1rem", sm: "1.25rem" },
              paddingLeft: "30px",
              mt: "60px",
              fontWeight: "bold",
              display: { xs: "none", sm: "block" },
            }}
          >
            Share Smarter, Spend Together!
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            paddingLeft: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={SplitImage}
            alt="Split Expense image"
            style={{ width: "70%", height: "auto" }}
          />
        </Grid>
      </Grid>
    </>
  );
}
