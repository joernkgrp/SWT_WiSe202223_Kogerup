import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GradientHeading } from "../components/GradientHeading";

export default function SimpleCard() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} minW={"md"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <GradientHeading fontSize="4xl" title="Anmelden"/>
          <Text fontSize={"lg"} color={"gray.600"}>
            Melde dich jetzt an, um mitzuspielen!
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"md"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>E-Mail-Adresse</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Passwort</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Login merken</Checkbox>
                <Link color={"blue.400"}>Passwort vergessen?</Link>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Anmelden
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Du hast noch keinen Account?{" "}
                <Link color={"blue.400"}>Registrieren</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
