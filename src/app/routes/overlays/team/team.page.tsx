import { Group } from "@mantine/core";
import { useMatch } from "@tanstack/react-router";

const TeamPage = () => {
  const { params } = useMatch("/overlays/team/$side");
  const { side } = params;
  return <Group noWrap>test</Group>;
};

export default TeamPage;
