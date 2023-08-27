import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'
import { MAX_FREE_COUNTS } from '@/components/constants'

const increaseApiLimit = async () => {
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

const checkApiLimit = async () => {
  const { userId } = auth()

  if (!userId) return false

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId }
  })

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) return true

  return false
}

export { increaseApiLimit, checkApiLimit }