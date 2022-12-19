import React, { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

import {
  Button,
  Box,
  Link as ChakraLink,
  Container,
  Heading,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { Main } from "../components/Main";
import { GradientHeading } from "../components/GradientHeading";

const Index = () => {
  const router = useRouter();

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Main>
          <GradientHeading fontSize="6xl" title="Quizlingo" />

          <Text color="text">
            Französisch lernen im spielerischen Duell mit <br />
            <Code>Next.js</Code> + <Code>chakra-ui</Code> +{" "}
            <Code>TypeScript</Code>.
          </Text>

          <List spacing={3} my={0} color="text">
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <ChakraLink
                isExternal
                href="https://chakra-ui.com"
                flexGrow={1}
                mr={2}
              >
                Chakra UI <LinkIcon />
              </ChakraLink>
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <ChakraLink
                isExternal
                href="https://nextjs.org"
                flexGrow={1}
                mr={2}
              >
                Next.js <LinkIcon />
              </ChakraLink>
            </ListItem>
          </List>
          <Button
            onClick={() => router.push("/load")}
            size="lg"
            variant="solid"
            colorScheme="orange"
            rounded="button"
            width="full"
          >
            Spiel starten
          </Button>
        </Main>
      </motion.div>
    </Container>
  );
};
export default Index;
