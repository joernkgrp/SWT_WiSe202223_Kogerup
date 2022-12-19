import React, { useState } from "react";
import {
  Box,
  Flex,
  Progress,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useRouter } from "next/router";

const loadingHeading1 = "Das Spiel wird gestartet …";
const loadingHeading2 = "Mache dich bereit. Es geht los!";

function Load() {
  const router = useRouter();
  const [progress, setProgress] = React.useState(0);
  const animationTime = 6;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          router.push("/game");
          return 100;
        }
        //const diff = Math.random() * 1/animationTime;
        return Math.min(oldProgress + 1/animationTime, 100);
      });
    }, 10);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Stack height={"100vh"} alignItems={"center"} justifyContent="center">
      <motion.div
        animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] }}
        transition={{ duration: animationTime, ease: "easeOut" }}
      >
        <Flex
          width={"100vw"}
          justifyContent="center"
          alignItems="center"
          bgGradient="linear(to-r, spainFlag.red, spainFlag.yellow)"
          bgClip="text"
        >
          <Heading fontSize="2xl">
            {progress < 50 ? loadingHeading1 : loadingHeading2}
          </Heading>
        </Flex>
      </motion.div>
      <Box width={"90vw"} pt={2}>
        <Progress
          size="sm"
          hasStripe
          value={progress}
          colorScheme="orange"
          borderRadius={"lg"}
        />
      </Box>
    </Stack>
  );
}

export default Load;
