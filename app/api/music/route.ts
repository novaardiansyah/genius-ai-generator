import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'

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

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial limit reached", { status: 403 })
    }

    if (!isPro) {
      await increaseApiLimit()
    }

    // TODO: remove this comment for real request
    // const response = await replicate.run(
    //   "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
    //   {
    //     input: {
    //       prompt_a: prompt
    //     }
    //   }
    // )

    // return NextResponse.json(response, { status: 200 })

    // TODO: comment this out for real request
    const response = [
      {
        audio: "/music/gen_sound.wav",
        spectrogram: "/music/gen_sound_spectrogram.jpg"
      },
      {
        audio: "/music/funky.wav",
        spectrogram: "/music/funky_spectogram.jpg"
      },
      {
        audio: "/music/piano_sad_vibe.wav",
        spectrogram: "/music/piano_sad_vibe_spectrogram.jpg"
      }
    ]

    // * random response
    const randomIndex = Math.floor(Math.random() * response.length)

    return NextResponse.json(response[randomIndex], { status: 200 })
  } catch (error) {
    console.error("[MUSIC_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}