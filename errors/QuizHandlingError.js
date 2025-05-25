class QuizHandlingError extends Error {
  constructor(message) {
    super(message);
    this.name = "QuizHandlingError";
  }
}

export default QuizHandlingError;
