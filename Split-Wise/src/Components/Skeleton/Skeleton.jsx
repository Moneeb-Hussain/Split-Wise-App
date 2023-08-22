import React from "react";
import { Box, Skeleton } from "@mui/material";

const ExpenseSkeleton = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Skeleton variant="rectangular" height={150} />
      <Skeleton variant="text" height={30} width={200} sx={{ mt: 2 }} />
      <Skeleton variant="text" height={30} width={150} sx={{ mt: 1 }} />
      <Skeleton variant="text" height={30} width={100} sx={{ mt: 1 }} />
    </Box>
  );
};

export default ExpenseSkeleton;
