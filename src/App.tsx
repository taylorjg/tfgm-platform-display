import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Stack, Typography } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);
  const { data, isSuccess } = useQuery({
    queryKey: ["demo"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return "TanStack Query is connected";
    },
  });

  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4" component="h1">
          Vite + React + TypeScript
        </Typography>
        <Typography color="text.secondary">
          Material UI and React Query are wired up.
        </Typography>
        {isSuccess && (
          <Typography variant="body2" color="success.main">
            {data}
          </Typography>
        )}
        <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
          Count is {count}
        </Button>
      </Stack>
    </Box>
  );
}

export default App;
