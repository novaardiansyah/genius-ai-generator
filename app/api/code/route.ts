import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const instructionMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content: 'You are pretending to be a professional programmer, and you are now give a junior developer a snippet of code to debug. The junior developer is asking you to generate a code for faster their work. You must answer only in markdown code snippets and use code comments for explain your code.'
}

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const messages = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not found", { status: 500 })
    }

    if (!messages) {
      return new NextResponse("Message not found", { status: 400 })
    }

    // TODO: remove this comment for real request
    // const response = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   messages: [instructionMessage, ...messages],
    // })

    // return NextResponse.json(response.data.choices[0].message, { status: 200 })

    // TODO: comment this out for real request
    return NextResponse.json({
      role: "system",
      content: "Sorry, I'm having trouble understanding you right now. Please try again later."
    }, { status: 200 })
  } catch (error) {
    console.error("[CODE_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}