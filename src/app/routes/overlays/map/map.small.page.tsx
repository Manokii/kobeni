import { Image } from "@mantine/core";
import { useStateData } from "../../../redux/redux.hook";

const MapSmall = () => {
  const { map: valMap } = useStateData();
  return <>{!valMap || <Image src={valMap.listViewIcon || ""} />}</>;
};

export default MapSmall;
