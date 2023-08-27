'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Music, Terminal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

import { formSchema } from './constants'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Heading } from '@/components/heading'
import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'

const MusicPage = () => {
  const router = useRouter()
  const [music, setMusic] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined)
      const response = await axios.post('/api/music', values)
      setMusic(response.data.audio)
    } catch (error: any) {
      // TODO: OpenAI pro version
      console.log('error', error?.message)
    } finally {
      form.reset()
      router.refresh()
    }
  }

  return (
    <>
      <Heading 
        title="Music Generation" 
        description="Turn your ideas into music."
        icon={Music} 
        iconColor="text-emerald-500" 
        bgColor="bg-emerald-500/10" 
      />

      <div className="px-4 lg:px-8 pb-8">
        <Alert className="mb-3">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Apologies, but the music generation feature is not available in this <span className="font-bold">demo</span> version. <br className="xs:hidden md:block" /> However, feel free to explore we have provided <i>random sample responses</i> for your enjoyment.
          </AlertDescription>
        </Alert>

        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-2 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({field}) => (
                  <FormItem className="col-span-12 md:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input 
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                        disabled={isLoading}
                        placeholder="Piano music with a happy vibe"  
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button className="col-span-12 md:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}

          {!music && !isLoading && (
            <Empty label="No music generated yet." />
          )}

          {music && (
            <audio
              controls
              className="w-full mt-8"
            >
              <source src={music} type="audio/mpeg" />
            </audio>
          )}
        </div>
      </div>
    </>
  )
}

export default MusicPage