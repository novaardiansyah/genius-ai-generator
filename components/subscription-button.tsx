'use client'

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import { useState } from 'react'

interface SubscriptionButtonProps {
  isPro: boolean
}

export const SubscriptionButton = ({ isPro = false}: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stripe')
      window.location.href = response.data.url
    } catch (error: any) {
      console.error('BILLING_ERROR', error?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={isPro ? 'default' : 'premium'} onClick={handleClick} disabled={loading}>
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {!isPro && <Zap className={'w-4 h-4 ml-2 fill-white'} />}
    </Button>
  )
}