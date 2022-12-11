// Java game to guess a random number

// Imports
import java.util.Random; // Generate random number
import java.util.Scanner; // Allow inputs

// Game class
public class Game {
    public static void main(String[] args) {
        // Stores actual and guess number
        int answer, guess, attempts;

        // Initialize number of attempts
        attempts = 0;

        // Define feedback responses
        String task = "Errate eine Zahl zwischen 1 und 100:";
        String numberTooLow = "Zu niedrig! Probiere es noch einmal.";
        String numberTooHigh = "Zu hoch! Probiere es noch einmal.";
        String numberCorrect = "Du hast die geheime Zahl erraten! Glückwunsch!";

        // Maximum value is 100
        final int maxNumber = 100;

        // Takes input using scanner
        Scanner in = new Scanner(System.in);

        // Random instance
        Random rand = new Random();

        // Initial input state
        boolean correct = false;

        // Correct answer
        answer = rand.nextInt(maxNumber) + 1;

        // Loop until the guess is correct
        while (!correct) {
            // Show task
            System.out.println(task);

            // Guess value
            guess = in.nextInt();

            // If guess is greater than random number
            if (guess > answer) {
                System.out.println(numberTooHigh);
                attempts++;
            }

            // If guess is less than random number
            else if (guess < answer) {
                System.out.println(numberTooLow);
                attempts++;
            }

            // Guess is equal to random number
            else {
                attempts++;
                System.out.println(numberCorrect);
                System.out.println("Du hast nur " + attempts + " Versuche gebraucht.");
                correct = true;
            }
        }
        // Close scanner and exit game
        in.close();
        System.exit(0);
    }
}