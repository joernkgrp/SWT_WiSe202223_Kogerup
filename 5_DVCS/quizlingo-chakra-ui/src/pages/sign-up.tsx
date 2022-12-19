import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { GradientHeading } from "../components/GradientHeading";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} minW={"md"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <GradientHeading fontSize="4xl" title="Registrieren" />

          <Text fontSize={"lg"} color={"gray.600"}>
            Lege jetzt ein Konto an, um mitzuspielen!
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"md"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="userName" isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" />
            </FormControl>

            <FormControl id="firstName" isRequired>
              <FormLabel>Vorname</FormLabel>
              <Input type="text" />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Passwort</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size={"lg"}
                colorScheme="orange"
                _hover={{
                  bg: "blue.500",
                }}
              >
                Registrieren
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Bereits ein Konto? <Link color={"orange.500"}>Einloggen</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
