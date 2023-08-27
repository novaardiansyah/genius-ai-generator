import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'
import { MAX_FREE_COUNTS } from '@/components/constants'

export const increaseApiLimit = async () => {
  const { userId } = auth()

  if (!userId) return

  // * Get user from database
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  // * If already exists, increase count
  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 }
    })
  } else {
    // * If not exists, create new
    await prismadb.userApiLimit.create({
      data: { userId, count: 1 }
    })
  }
}

export const checkApiLimit = async () => {
  const { userId } = auth()

  if (!userId) return false

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId }
  })

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) return true

  return false
}

export const getApiLimitCount = async () => {
  const { userId } = auth()

  if (!userId) return 0

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId }
  })

  if (!userApiLimit) return 0

  return userApiLimit.count
}
