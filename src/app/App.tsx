import { Box, MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { reduxStore } from "./redux";
import { router } from "./router";
import SocketProvider from "./socket/socket.provider";

function App() {
  return (
    <Box h="100vh" w="100vw">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <Provider store={reduxStore}>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </Provider>
      </MantineProvider>
    </Box>
  );
}

export default App;
