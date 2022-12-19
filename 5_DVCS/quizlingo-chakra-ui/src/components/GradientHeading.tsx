import { Flex, Heading, HeadingProps } from "@chakra-ui/react";

export const GradientHeading = (props: HeadingProps) => (
  <Heading
    as="h1"
    pb={2}
    bgGradient="linear(to-r, spainFlag.red, spainFlag.yellow)"
    bgClip={"text"}
    {...props}
  >
    {props.title}
  </Heading>
);
