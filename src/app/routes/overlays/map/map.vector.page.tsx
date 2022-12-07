import { Image } from "@mantine/core";
import { useStateData } from "../../../redux/redux.hook";

const MapVector = () => {
  const { map: valMap } = useStateData();
  return <>{!valMap || <Image src={valMap.displayIcon || ""} />}</>;
};

export default MapVector;
