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
    const res = await openai.createCompletion({
      model: 'text-davinci-003',
      temperature: 0,
      max_tokens: 3600,
      prompt: `Write a long and detailed SEO-friendly blog post about${topic} in Traditional Chinese ，針對以下用逗號分隔的關鍵字:${keywords}。
      The content should be formatted in SEO-friendly HTML.
      Make sure the content in correct paragraphs.
      The response must also include appropriate HTML title and meta description content.
      The response format must be valid JSON (with no \n or \t in the output) in the following format:
      {
        "postContent": post content here
        "title": title goes here
        "metaDesc": meta description goes here
      }`,
    })

    const parsed = JSON.parse(res?.data?.choices[0]?.text.split('\n').join(''))

    return parsed
  } catch (error) {
    res.status(500).json({
      message: 'The response could not be parsed into JSON',
      data: res?.data?.choices[0]?.text,
    })
    return
  }
}

export default openai
