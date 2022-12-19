import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import {
  Box,
  Container,
  Divider,
  Flex,
  Progress,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { User } from "../components/User";
import { questions } from "../data/questions";
import { Main } from "../components/Main";
import { GradientHeading } from "../components/GradientHeading";
import theme from "../theme";

// Global variables to be exported
var finalScore = 0;

const Game = () => {
  const delay = 1000;
  const answerTime = 10000;
  const initialProgress = 100;
  const timerRefresh = 1000;

  const router = useRouter(); // Go to next page
  const toast = useToast(); // Define toast

  var maxSteps = questions.length; // Number of questions

  // Define React hooks
  var [activeStep, setActiveStep] = React.useState(0);
  var [score, setScore] = useState(0);
  var [progress, setProgress] = useState(initialProgress);

  // Go to next question
  function handleNext(delay) {
    setTimeout(() => {
      if (activeStep < maxSteps - 1) {
        setActiveStep(activeStep + 1);
      }

      if (activeStep == maxSteps - 1) {
        finalScore = score;
        console.log(score);
        router.push("/results");
      }

      setProgress(initialProgress);
    }, delay);
  }

  // Toast definition
  function toastTimeout() {
    toast({
      position: "bottom",
      title: "Zeit abgelaufen!",
      status: "error",
      duration: delay,
      isClosable: false,
    });
  }

  // Show correct answer after timeout
  function showCorrectAnswer(delay) {
    var correctOption = questions[activeStep].correctOption;
    var correctOptionString = document.getElementById(correctOption.toString());

    toastTimeout();
    correctOptionString.style.backgroundColor = theme.colors.green[500];
    correctOptionString.style.color = theme.colors.white;

    setTimeout(() => {
      correctOptionString.style.backgroundColor = theme.colors.gray[200];
      correctOptionString.style.color = theme.colors.gray[800];

      handleNext(delay);
    }, delay);
  }

  // Check given response
  function checkResponse(clickedOption) {
    setProgress(0);

    var correctOption = questions[activeStep].correctOption;
    var clickedOptionString = document.getElementById(clickedOption.toString());
    var correctOptionString = document.getElementById(correctOption.toString());

    // Change color to green for correct answer
    correctOptionString.style.backgroundColor = theme.colors.green[500];
    correctOptionString.style.color = theme.colors.white;

    setTimeout(() => {
      clickedOptionString.style.backgroundColor = theme.colors.gray[200];
      clickedOptionString.style.color = theme.colors.gray[800];
      correctOptionString.style.backgroundColor = theme.colors.gray[200];
      correctOptionString.style.color = theme.colors.gray[800];

      handleNext(delay);
    }, delay);

    if (clickedOption === correctOption) {
      setScore((score += 1));
      console.log(score);
    } else {
      clickedOptionString.style.backgroundColor = theme.colors.red[500];
      clickedOptionString.style.color = theme.colors.white;
    }
  }

  // Set timer to 10 sec
  let timer;
  let timer2;

  const updateCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        showCorrectAnswer(delay);
      }, answerTime);
  };

  const progressBar = () => {
    timer2 =
      !timer2 &&
      setInterval(() => {
        setProgress((progress) => progress - answerTime / timerRefresh - 1);
      }, timerRefresh);
  };

  useEffect(() => {
    updateCount();

    return () => clearInterval(timer);
  }, [activeStep]);

  useEffect(() => {
    progressBar();

    return () => clearInterval(timer2);
  }, [progress]);

  return (
    <Container>
      <Main>
        <Flex align={"center"}>
          <Text fontSize="lg" fontWeight={"semibold"}>
            Pregunta {activeStep + 1} de {maxSteps}
          </Text>

          <Spacer />

          <User name="Tom Bola" variant="right" score={score}></User>
        </Flex>

        <div className="wrapper">
          <motion.div
            style={{ originX: 0 }}
            animate={{ width: progress + "%" }}
            transition={{ ease: "easeInOut" }}
            className="box"
          />
          <motion.div animate={{ width: "100%" }} className="boxBackground" />
        </div>

        <Divider />

        <Text fontSize={"lg"}>{questions[activeStep].taskText}</Text>

        <GradientHeading
          fontSize="3xl"
          title={questions[activeStep].questionText}
        />

        {questions[activeStep].options.map((option, optionIndex) => (
          <Box
            bgColor="gray.200"
            borderRadius="lg"
            p={4}
            id={optionIndex.toString()}
            /** _hover={{ bg: "gray.300" }} **/
            onClick={() => checkResponse(optionIndex)}
            cursor="pointer"
            transition="0.25s ease-out"
          >
            <Text fontSize={"lg"}>{option}</Text>
          </Box>
        ))}
      </Main>
    </Container>
  );
};

export default Game;
export { finalScore };
