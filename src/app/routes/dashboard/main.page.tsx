import { Card, Code, Container, Stack, Text, Title } from "@mantine/core"

const urls = {
  agentsAll: "/overlays/players/all",
  agentsRed: "/overlays/players/red",
  agentsBlue: "/overlays/players/blue",
  agentSingle: "/overlays/players/{red|blue}/{1-5}",
  map: "/overlays/map/vector",
  mapSplash: "/overlays/map/splash",
  mapSmall: "/overlays/map/small",
}

type CodeBlockItem = {
  title: string
  description?: string
  codeBlock: string
}

interface CodeBlockProps {
  title: string
  description?: string
  codeBlocks: CodeBlockItem[]
}

const CodeBlock = ({ title, description, codeBlocks }: CodeBlockProps) => {
  return (
    <Card>
      <Stack>
        <Title order={4}>{title}</Title>
        {description && <Text>{description}</Text>}

        <Stack>
          {codeBlocks.map((block, i) => (
            <Stack spacing={5} key={i}>
              <Title order={6}>{block.title}</Title>
              {block.description && <Text>{block.description}</Text>}
              <Code block>{`http://${window.location.host}${block.codeBlock}`}</Code>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

const DashboardMainPage = () => {
  return (
    <Container py="xl" w="100%" size="lg">
      <Stack>
        <Title>Welcome</Title>
        <Text>
          Here are your quick links to the overlays. Add it to OBS as a browser source and play with
          width and height. It takes the whole height and distributes the width for all agents.
        </Text>

        <Stack spacing="xl">
          <CodeBlock
            title="Agent Select - Players"
            description={`Player agents for agent select screen.
                          You can add ?px=100&py=100&playerGap=200&teamGap=200
                          to the url to configure the spacing.`}
            codeBlocks={[
              {
                title: "Both Teams",
                codeBlock: urls.agentsAll,
              },
              {
                title: "Red Team",
                codeBlock: urls.agentsRed,
              },
              {
                title: "Blue Teams",
                codeBlock: urls.agentsBlue,
              },
              {
                title: "Get Singler Pick",
                description:
                  "Replace {red|blue} with the team side and {1-5} with the player slot number",
                codeBlock: urls.agentSingle,
              },
            ]}
          />
          <CodeBlock
            title="Agent Select - Map"
            description="Map overlay urls for agent select screen"
            codeBlocks={[
              {
                title: "Vector Mao",
                codeBlock: urls.map,
              },
              {
                title: "Splash",
                codeBlock: urls.mapSplash,
              },
              {
                title: "Small",
                codeBlock: urls.mapSmall,
              },
            ]}
          />
        </Stack>
      </Stack>
    </Container>
  )
}

export default DashboardMainPage
