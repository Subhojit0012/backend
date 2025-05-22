import prisma from "../database/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  poolBatchToken,
} from "../utils/judge0.utils.js";

export const createProblem = async function (req, res) {
  // get data from req body
  const {
    title,
    description,
    defficulty,
    tags,
    examples,
    constrains,
    hints,
    editorial,
    testcases,
    codeSnippet,
    referanceSolution,
  } = req.body;

  // check if the user is admin
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.status(400).json({
      message: "You are not allowed to create a problem",
    });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referanceSolution)) {
      // get the language id
      const languageId =await getJudge0LanguageId(language);
      // check the correct id
      if (languageId === 0) {
        return res.status(400).json({
          message: `Language ${language} is not supported`,
        });
      }

      // create the submission
      const submission = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      console.log("Submission: ", submission); // !

      // submission data in array format
      const data = await submitBatch(submission);

      // extract the token from the data
      const tokens = data.map((res) => res.token);

      const results = await poolBatchToken(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            message: `Test case ${i + 1} failed for language ${language}`,
            data: result,
          });
        }
      }
    }

    // create problem in database
    const problem = await prisma.user.create({
      data: {
        title,
        description,
        defficulty,
        tags,
        examples,
        constrains,
        hints,
        editorial,
        codeSnippet,
        userId: req.user.id,
      },
    });

    return res.status(200).json(problem);
  } catch (error) {
    console.log("Error creating problem: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getProblem = async function (req, res) {};
export const getAllProblem = async function (req, res) {};
export const solvedProblem = async function (req, res) {};
export const updateProblem = async function (req, res) {};
export const getSolvedProblem = async function (req, res) {};
export const deleteProblem = async function (req, res) {};
