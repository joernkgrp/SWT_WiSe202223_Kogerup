import React, { useState } from "react";
import { useBoolean } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export const Answer = ({ answerOption }: { answerOption: string }) => {
  const [value, setValue] = useBoolean(false);
  var confirm = value ? "" : "nicht";

  return (
    <Box borderRadius="md" bg="gray.100" w="100%" p={4} color="black">
      <Text onClick={setValue.toggle}>{answerOption}</Text>
      Du hast die Antwort {confirm} geklickt.
    </Box>
  );
};
