import { Configuration, OpenAIApi } from 'openai'

export const config = {
  runtime: 'edge',
}

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(openAiConfig)

export const responseData = async (topic, keywords) => {
  try {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a blog post generator',
        },
        {
          role: 'user',
          content: `Write a long and detailed SEO-friendly blog post about${topic} in Traditional Chinese ，針對以下用逗號分隔的關鍵字:${keywords}。
          The content should be formatted in SEO-friendly HTML.
          Make sure the content in correct paragraphs.
          The response must also include appropriate HTML title and meta description content.
          The response format must be stringified JSON in the following format:
          {
            "postContent": post content here
            "title": title goes here
            "metaDesc": meta description goes here
          }`,
        },
      ],
      temperature: 0,
      max_tokens: 3600,
      stream: true,
    })

    return res
  } catch (error) {
    console.error(error)
  }
}

export default openai
