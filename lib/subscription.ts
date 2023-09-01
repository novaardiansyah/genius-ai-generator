import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

const DAY_IN_MS = 84_400_000

export const checkSubscription =async () => {
  const { userId } = auth()
  if (!userId) return false

  const userSubcription = await prismadb.userSubscription.findUnique({
    where: { userId },
    select: {
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
      stripePriceId: true
    }
  })

  if (!userSubcription) return false

  const isValid = userSubcription.stripeCustomerId && userSubcription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return !!isValid
}