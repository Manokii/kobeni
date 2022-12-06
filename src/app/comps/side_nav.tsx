import { createStyles, Navbar, ScrollArea, Stack } from "@mantine/core";
import { IconBrandTabler, TablerIcon } from "@tabler/icons";
import { useState } from "react";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
      },
    },
  };
});

type Link = {
  link: string;
  label: string;
  icon: TablerIcon;
};
const links: Link[] = [
  {
    link: "/",
    label: "Main",
    icon: IconBrandTabler,
  },
];

const SideNav = () => {
  const { classes, cx } = useStyles();

  const [active, setActive] = useState<typeof links[number]["link"]>("/");

  const linkComps = links.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.link === active })}
      href={item.link}
      key={item.link}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md">
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <Stack>{linkComps}</Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default SideNav;
