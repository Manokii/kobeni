import { Box } from "@mantine/core";
import { StatePlayer } from "lib/state";

interface Props {
  player: StatePlayer;
  side: "red" | "blue";
}
const Player = ({ player, side }: Props) => {
  return (
    <Box h="100%" sx={{ position: "relative", overflow: "visible" }}>
      <Box
        h="100%"
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          aspectRatio: "1772 / 1609",
          zIndex: 40,
          maskImage: "linear-gradient(transparent 40%,  black)",
          overflow: "visible",
        }}
      >
        <img
          src={player.agent?.portrait || ""}
          alt=""
          style={{
            overflow: "visible",
            height: "100%",
            width: "auto",
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            filter: ` hue-rotate(${side === "red" ? 75 : 275}deg) brightness(5) `,
          }}
        />
      </Box>
      <img
        src={player.agent?.portrait || ""}
        alt=""
        style={{
          zIndex: 30,
          height: "100%",
          width: "auto",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <Box
        sx={{
          zIndex: 10,
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
          backgroundImage: `url("${player.agent?.bg}")`,
        }}
      />
    </Box>
  );
};

export default Player;
