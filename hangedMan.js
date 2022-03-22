/*Hanged Man game flow: 
One word is chosen randomly from an array of words. The user gets it as a secret word 
(shows in asterisks), and have 10 attempts to guess it. In every turn, the user enter a letter 
(we validate that) and if the letter is in the word, all of the asterisk that represents that letter are
replaced with the letter. The user lose attempt if he entered a letter that does not appear in the word.
The game ends when the number of attempts is 0, or the user succeeded to guess the entire word
(letter by letter or in one shot).*/

'use strict';
const prompt = require('prompt-sync')();
const figlet = require('figlet');

const wordsArray = [
  'banjo',
  'pajama',
  'polka',
  'puppy',
  'ghibli',
  'disney',
  'zombie',
  'microwave',
  'hamburger',
  'kettlebell',
  'elephant',
  'strawberry',
  'pixar',
  'microsoft',
];

const totalAttempts = 10;

// Print a welcome message to the user with the name of the game.
const printWelcomeMessage = () => {
  console.log(figlet.textSync('HANGED MAN', 'Dancing Font'));
};

/* Pick random word from wordArray: This function gets an array of words and using the random() function
to get a random number between 0 - 1. Than we multiply this number with the length of the array of words
and rounds it down.*/
const pickRandomWord = (wordsArray) => {
  return wordsArray[Math.floor(Math.random() * wordsArray.length)];
};

/* Display the word by asterisks: This function gets a word and return a sequence of asterisks 
(the number of asterisks return is the same as the length of the word).*/
const wordToAsterisks = (word) => {
  return '*'.repeat(word.length);
};

/* Get user input: This function print a message for the user and gets the user input. 
Than it convert the input to lower case (because all the words in the game are in lowercase and the guess
is not case sensitive).*/
const getUserInput = () => {
  console.log('What is your guess?');
  let input = prompt();
  return input.toLowerCase();
};

/*Validate user input: This function checks if the input is valid. If the user didn't enter a letter
(entered a symbol or number- we use regex to check it), or not a single letter, than the function returns false. 
Otherwise it returns true (the input is only one letter).*/
const inputValidation = (userInput, word) => {
  if (
    /[^a-z]/.test(userInput) ||
    (userInput.length > 1 && userInput !== word)
  ) {
    return false;
  } else {
    return true;
  }
};

/*This function gets a word, a letter from the user and check if the input is valid, 
than returns the user input and the result of the validation (true or false).*/
const userInputFormating = (word) => {
  let userInput = getUserInput();
  let isValid = inputValidation(userInput, word);
  return [userInput, isValid];
};

/*This function gets a word and a letter and checks if the letter is in the word. 
The function returns an array of the indexes in which the letter is in.*/
const getLetterIndexes = (word, letter) => {
  let indexesArray = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      indexesArray.push(i);
    }
  }
  return indexesArray;
};

/* Defining the replaceAt function: this function gets an index of the char we want to replace
 and the replacement letter, and return the new string after the replacement occur. */
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

/*Replace asterisks with letters: This function gets a word, an asterisks word (which is the secret word) 
and a letter. Than we call the function getLetterIndexes() and if the length of this array is longer 
than zero, than it's mean that the letter is in the word, 
so we go over the array and replace the asterisks in the secret word in the matching indexes.*/
const replaceAsterisksToLetters = (word, asterisksWord, letter) => {
  let indexesArray = getLetterIndexes(word, letter);
  if (indexesArray.length > 0) {
    for (let i = 0; i < indexesArray.length; i++) {
      asterisksWord = asterisksWord.replaceAt(indexesArray[i], letter);
    }
  }
  return asterisksWord;
};

/* Get the number of guesses remain: This function gets a word, letter and the number of attempts the user
have, than we check if the letter includes in the word, if so, the user doesn't lose an attempt. 
If the lettter is not in the word than the user loss one attempt. */
const getGuessesNum = (word, letter, attempts) => {
  if (!word.includes(letter)) {
    attempts -= 1;
  }
  return attempts;
};

/*This function print the number of attempts and the secret word. */
const printAttemptsAndWord = (attempts, secretWord) => {
  console.log(`you have ${attempts} guesses.`);
  console.log('the word is:');
  console.log(secretWord);
};

/* This function check if the user succeeded to guess the word: if there is no asterisks in asterisks word, 
than it means that the user succeeded to discover the entire word, therefore the function 
asterisksWord.includes('*') return false and the function checkWin() return true (because the ! sign). 
Otherwise for the situation when the word still have asterisks.*/
const checkWin = (asterisksWord) => {
  return !asterisksWord.includes('*');
};

/*This function gets the user input and the word. If the user succeeded to discover the word in one shot, 
than a figlet message appear on the console. This function also return true 
(if the user succeeded in guessing the entire word), or false otherwise.*/
const guessEntireWord = (userInput, word) => {
  if (userInput === word) {
    console.log(figlet.textSync('AMAZING!!', 'Dancing Font'));
    console.log('You succeeded to guess the entire word in one attempt!');
    return true;
  }
  return false;
};

/*This function checks if the game ended. If the game ended (the number of attempts remain is zero and 
  the user didn't win), a loss message is printing. If the user won and the number of attempts remain 
  isn't zero, than a winning message is printing. */
const printWinOrLoss = (attempts, isWin, word) => {
  if (attempts === 0 && !isWin) {
    console.log('END GAME! You Lose!');
    console.log('The word was:');
    console.log(word);
  } else if (isWin && attempts !== 0) {
    console.log('GOOD JOB! You are the best!');
    console.log('The word was:');
    console.log(word);
  }
};

/*This function represent the entire game logic:
a message with the game's name is shown, a word is pick from the array of words and an asterisks word 
is create according to the chosen word.
The numbers of attempts and the secret word are print to the console.
The game is running until the user won or the number of attempts is equal to zero:
we get the user input and check if it is valid, if not, we will continue get his input until the input 
is valid. Than we check if the user succeeded guesing the untire word, and if he does, the game ends.
Than (if the game is still running) we replace the asterisks in the secret word with the letter
(if the letter is in the word) and change the number of attempts remain. At the end of every iteration
of the game we check if the user won and change isWin arguments. 
When the game ends we print a message to the user about the loss or winning.*/
const newGame = () => {
  printWelcomeMessage();
  let attempts = totalAttempts;
  let isWin = false;
  let chosenWord = pickRandomWord(wordsArray);
  let secretWord = wordToAsterisks(chosenWord);
  printAttemptsAndWord(attempts, secretWord);
  while (attempts > 0 && !isWin) {
    let [userInput, isValid] = userInputFormating(chosenWord);
    while (!isValid) {
      console.log('The guess is invalid. Please enter one letter');
      printAttemptsAndWord(attempts, secretWord);
      [userInput, isValid] = userInputFormating(chosenWord);
    }
    if (guessEntireWord(userInput, chosenWord)) {
      break;
    }
    secretWord = replaceAsterisksToLetters(chosenWord, secretWord, userInput);
    attempts = getGuessesNum(chosenWord, userInput, attempts);
    printAttemptsAndWord(attempts, secretWord);
    isWin = checkWin(secretWord);
  }
  printWinOrLoss(attempts, isWin, chosenWord);
};

newGame();
