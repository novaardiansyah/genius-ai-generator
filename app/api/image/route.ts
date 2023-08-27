import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, amount = 1, resolution = '512x512' } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not found", { status: 500 })
    }

    if (!prompt) {
      return new NextResponse("Prompt not found", { status: 400 })
    }

    const freeTrial = await checkApiLimit()

    if (!freeTrial) {
      return new NextResponse("Free trial limit reached", { status: 403 })
    }

    await increaseApiLimit()

    // TODO: remove this comment for real request
    // const response = await openai.createImage({
    //   prompt,
    //   n: parseInt(amount),
    //   size: resolution
    // })

    // return NextResponse.json(response.data.data, { status: 200 })

    // TODO: comment this out for real request
    let images = []
    for (let i = 0; i < parseInt(amount); i++) {
      images.push({ url: `https://source.unsplash.com/random/${resolution}/?${prompt}%20${i}` })
    }

    return NextResponse.json(images, { status: 200 })
  } catch (error) {
    console.error("[IMAGES_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}