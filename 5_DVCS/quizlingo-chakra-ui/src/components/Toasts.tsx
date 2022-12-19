import {
  Box,
  Container,
  Divider,
  Flex,
  Spacer,
  Progress,
  Text,
  useToast,
} from "@chakra-ui/react";

const toast = useToast(); // Define toast

// Toast for correct and wrong given answer
function ToastResponse(correct: boolean) {
  if (correct) {
    toast({
      position: "bottom",
      title: "¡Correcto!",
      status: "success",
      duration: 1000,
      isClosable: false,
    });
  } else {
    toast({
      position: "bottom",
      title: "¡Incorrecto!",
      status: "error",
      duration: 1000,
      isClosable: false,
    });
  }
}
