'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

import { useProModal } from '@/hooks/use-pro-modal'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { tools } from '@/components/constants'
import { Check, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export const ProModal = () => {
  const [loading, setLoading] = useState(false)
  const proModal = useProModal()
  const router = useRouter()

  const onSubscribe = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stripe')

      window.location.href = response.data.url
    } catch (error: any) {
      console.error('STRIPE_CLIENT_ERROR: ', error?.message || 'Something went wrong!')
      toast.error(error?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={cn("flex justify-center items-center flex-col gap-y-4 pb-2")}>
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to Genius
              <Badge className="text-sm uppercase py-1" variant={'premium'}>Pro</Badge>
            </div>
          </DialogTitle>

          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool, index) => {
              if (tool.href !== '/dashboard' && tool.href !== '/settings') return (
                <Card
                  onClick={() => router.push(tool.href)}
                  key={index}
                  className="p-3 border-black/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                      <tool.icon className={cn("w-8 h-8", tool.color)} />
                    </div>

                    <p className="font-semibold text-sm">{tool.label}</p>
                  </div>

                  <Check className="text-primary w-5 h-5" />
                </Card>
              )
            })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button 
            size={'lg'} 
            variant={'premium'} 
            className={cn('w-full')}
            onClick={onSubscribe}
            disabled={loading}
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}