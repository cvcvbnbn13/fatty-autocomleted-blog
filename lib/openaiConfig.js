import { Configuration, OpenAIApi } from 'openai'

export const config = {
  runtime: 'edge',
}

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(openAiConfig)

export default openai
