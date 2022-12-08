import { SimpleGrid } from "@mantine/core"
import { useMatch } from "@tanstack/react-router"
import type { StatePlayer } from "lib/state"
import { useStateData } from "../../../redux/redux.hook"
import Player from "./comps/player"

const PlayerTeamPage = () => {
  const { params, search } = useMatch("/overlays/players/$side")
  const { blue, red } = useStateData()

  const fillTeam = (players: StatePlayer[]): StatePlayer[] => {
    const firstPlayer = players[0] || red[0] || blue[0]
    if (!firstPlayer) return []
    return [...players, ...new Array(5 - players.length).fill(firstPlayer)]
  }

  const completeTeam = fillTeam(params.side === "red" ? red : blue)

  return (
    <SimpleGrid h="100%" w="100%" spacing={search.playerGap} cols={5} sx={{ flexGrow: 1 }}>
      {completeTeam.map((player, index) => (
        <Player player={player} side="blue" key={index} />
      ))}
    </SimpleGrid>
  )
}

export default PlayerTeamPage
