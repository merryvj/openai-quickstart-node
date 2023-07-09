import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const query = req.body.query || '';
  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid query",
      }
    });
    return;
  }

  let history = req.body.history;


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(query, history),
      temperature: 0.9,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(query, history) {
  const capitalizedQuery =
    query[0].toUpperCase() + query.slice(1).toLowerCase();
  return `Generate a comma separated list of 5 diverse search results related to a query. They should explore different concepts and give a broad overview of the field.

  Query: Basketball
  Results: College Basketball, NBA, Basketball Drills, Kobe Bryant, 3 Point Line

  Query: Japan
  Results: Shinto, Hokusai, Edo, Shinkansen, Kanji, Ikebana


  Query: ${history + "&" + capitalizedQuery}
  Results:`
}
