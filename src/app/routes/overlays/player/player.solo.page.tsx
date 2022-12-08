import { Center } from "@mantine/core";
import { useMatch } from "@tanstack/react-router";
import type { StatePlayer } from "lib/state";
import { useStateData } from "../../../redux/redux.hook";
import Player from "./comps/player";

const PlayerSoloPage = () => {
  const { params } = useMatch("/overlays/players/$side/$playerIndex");
  const { blue, red } = useStateData();

  const p: StatePlayer | undefined = (params.side === "red" ? red : blue)[params.playerIndex - 1];
  return (
    <Center h="100%" w="100%">
      {p && <Player player={p} side={params.side} />}
    </Center>
  );
};

export default PlayerSoloPage;
