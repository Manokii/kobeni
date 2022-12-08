import { Box, MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { Provider } from "react-redux"
import { reduxStore } from "./redux"
import { router } from "./router"
import SocketProvider from "./socket/socket.provider"

const queryClient = new QueryClient()

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
        <QueryClientProvider client={queryClient}>
          <Provider store={reduxStore}>
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </Provider>
        </QueryClientProvider>
      </MantineProvider>
    </Box>
  )
}

export default App
