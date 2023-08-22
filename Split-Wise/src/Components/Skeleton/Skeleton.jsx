import React from "react";
import { Box, Skeleton } from "@mui/material";

const ExpenseSkeleton = () => {
  return (
    <Box sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" height={120} width="100%" sx={{ mt: 5, mb: 3 }} />
    </Box>
  );
};

export default ExpenseSkeleton;
