import { Image } from "@mantine/core"
import { useStateData } from "../../../redux/redux.hook"

const MapSplash = () => {
  const { map: valMap } = useStateData()
  return <>{!valMap || <Image src={valMap.splash || ""} />}</>
}

export default MapSplash
