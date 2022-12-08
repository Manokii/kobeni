import { Box } from "@mantine/core"
import { AnimatePresence, motion } from "framer-motion"
import { StatePlayer } from "lib/state"

interface Props {
  player: StatePlayer
  side: "red" | "blue"
}
const Player = ({ player, side }: Props) => {
  // const rgb = hexToRgb(side === "red" ? "#b94650" : "#3d70c2")
  // const color = new Color(rgb[0], rgb[1], rgb[2])
  // const solver = new Solver(color)
  // const result = solver.solve()

  return (
    <Box h="100%" sx={{ position: "relative", overflow: "visible" }}>
      {/* {side && (
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
              filter: result.filter,
            }}
          />
        </Box>
      )} */}
      <AnimatePresence>
        {!!player.agent && player.status === "locked" && (
          <motion.div
            key={player.agent.id}
            initial={{ opacity: 0, y: "20px" }}
            animate={{ opacity: 1, y: "0px" }}
            exit={{ opacity: 0, y: "-20px" }}
            style={{
              zIndex: 30,
              height: "100%",
              width: "100%",
              position: "relative",
            }}
          >
            <img
              src={player.agent?.portrait || ""}
              alt=""
              style={{
                height: "100%",
                width: "auto",
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!!player.agent && (
          <motion.div
            key={player.agent.id}
            initial={{ opacity: 0, y: "-20px" }}
            animate={{ opacity: player.status === "locked" ? 0.15 : 0.3, y: "0px" }}
            exit={{ opacity: 0, y: "10px" }}
            style={{
              zIndex: 10,
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url("${player.agent.bg}")`,
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Player
