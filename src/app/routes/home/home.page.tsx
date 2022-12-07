import { Button, Center, Container, Stack, Text, Title } from "@mantine/core";
import { useMatch } from "@tanstack/react-router";

const HomePage = () => {
  const router = useMatch("/");

  const gotoDashboard = () => {
    router.navigate({ to: "/dashboard" });
  };
  return (
    <Container size="xs" h="100%">
      <Center h="100%">
        <Stack align="center">
          <Title order={3}>KOBENI</Title>
          <Stack align="center">
            <Text align="center">
              Kobeni is an overlay app that integrates with directly with game state using client
              api
            </Text>
            <Button size="xs" onClick={gotoDashboard}>
              Go to Dashboard
            </Button>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
};

export default HomePage;
