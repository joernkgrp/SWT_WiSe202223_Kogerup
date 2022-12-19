import { motion } from "framer-motion";

import {
  Button,
  Box,
  Container,
  List,
  ListItem,
  ListIcon,
  Heading,
  Text,
  Spacer,
  Divider,
} from "@chakra-ui/react";

import { CheckCircleIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";

import { Main } from "../components/Main";
import { User } from "../components/User";
import { GradientHeading } from "../components/GradientHeading";
import { finalScore } from "./game";

function GameAssessment(props) {
  if (props.finalScore == 5) {
    return <Text fontSize="lg">¡Fantástico! Besser geht es nicht mehr.</Text>;
  } else if (props.finalScore > 2) {
    return <Text fontSize="lg">Das war schon richtig bueno.</Text>;
  } else {
    return (
      <Text fontSize="lg">Beim nächsten Mal wird es bestimmt besser.</Text>
    );
  }
}

const Results = () => {
  const router = useRouter();

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Main>
          <GradientHeading fontSize="3xl" title="Spiel beendet" />
          <Divider />

          <User name="Tom Bola" score={finalScore} variant="left"></User>
          <GameAssessment finalScore={finalScore} />

          <Spacer minH={8} />

          <Button
            onClick={() => router.push("/")}
            size="lg"
            variant="solid"
            colorScheme="orange"
            rounded="button"
            width="full"
          >
            Zur Startseite
          </Button>
        </Main>
      </motion.div>
    </Container>
  );
};

export default Results;
