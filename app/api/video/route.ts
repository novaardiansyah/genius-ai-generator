import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
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
    // const response = await replicate.run(
    //   "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    //   {
    //     input: {
    //       prompt: prompt
    //     }
    //   }
    // )

    // return NextResponse.json(response, { status: 200 })

    // TODO: comment this out for real request
    const response = [
      '/video/bee-pollinating-a-flower.mp4',
      '/video/clown-fish-swimming-in-coral.mp4',
      '/video/clown-fish-swimming-in-coral-2.mp4'
    ]

    // * random response
    const randomIndex = Math.floor(Math.random() * response.length)

    return NextResponse.json([response[randomIndex]], { status: 200 })
  } catch (error) {
    console.error("[VIDEO_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}