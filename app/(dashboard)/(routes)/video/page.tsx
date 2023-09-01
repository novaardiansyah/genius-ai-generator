'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { VideoIcon, Terminal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { formSchema } from './constants'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Heading } from '@/components/heading'
import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'

import { useProModal } from '@/hooks/use-pro-modal'
import toast from 'react-hot-toast'

const VideoPage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [video, setVideo] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined)
      const response = await axios.post('/api/video', values)
      setVideo(response.data[0])
    } catch (error: any) {
      // TODO: OpenAI pro version
      if (error?.response?.status === 403) proModal.onOpen()
      else {
        toast.error(error?.message || 'Something went wrong.')
        console.error(error)
      }
    } finally {
      form.reset()
      router.refresh()
    }
  }

  return (
    <>
      <Heading 
        title="Video Generation" 
        description="Turn your ideas into awesome videos."
        icon={VideoIcon} 
        iconColor="text-orange-700" 
        bgColor="bg-orange-700/10" 
      />

      <div className="px-4 lg:px-8 pb-8">
        <Alert className="mb-3">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Apologies, but the video generation feature is not available in this <span className="font-bold">demo</span> version. <br className="xs:hidden md:block" /> However, feel free to explore we have provided <i>random sample responses</i> for your enjoyment.
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
                        placeholder="Clown fish swimming in a coral reef"  
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

          {!video && !isLoading && (
            <Empty label="No video generated yet." />
          )}

          {video && (
            <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
              <source src={video} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </>
  )
}

export default VideoPage