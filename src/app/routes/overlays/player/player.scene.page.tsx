import { Box, Group, SimpleGrid } from "@mantine/core"
import { useMatch } from "@tanstack/react-router"
import type { StatePlayer } from "lib/state"
import { useStateData } from "../../../redux/redux.hook"
import Player from "./comps/player"

const PlayerScenePage = () => {
  const { red, blue } = useStateData()
  const { search } = useMatch("/overlays/players/all")

  const fillTeam = (players: StatePlayer[]): StatePlayer[] => {
    const firstPlayer = players[0] || red[0] || blue[0]
    if (!firstPlayer) return []
    return [...players, ...new Array(5 - players.length).fill(firstPlayer)]
  }

  const completeBlue = fillTeam(blue)
  const completeRed = fillTeam(red)

  console.log({ red, blue })

  return (
    <Box p={search.p || 30} px={search.px || 100} py={search.py} h="100%" w="100%">
      <Group
        position="apart"
        noWrap
        h="100%"
        w="100%"
        align="flex-start"
        spacing={search.teamGap || 200}
      >
        <SimpleGrid h="100%" spacing={search.playerGap} cols={5} sx={{ flexGrow: 1 }}>
          {completeBlue.map((player, index) => (
            <Player player={player} side="blue" key={index} />
          ))}
        </SimpleGrid>
        <SimpleGrid h="100%" spacing={search.playerGap} cols={5} sx={{ flexGrow: 1 }}>
          {completeRed.map((player, index) => (
            <Player player={player} side="red" key={index} />
          ))}
        </SimpleGrid>
      </Group>
    </Box>
  )
}

export default PlayerScenePage
