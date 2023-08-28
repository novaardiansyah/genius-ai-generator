'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Heading } from '@/components/heading'
import { Code } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

import { formSchema } from './constants'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChatCompletionRequestMessage } from 'openai'
import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'
import { UserAvatar } from '@/components/user-avatar'
import { BotAvatar } from '@/components/bot-avatar'

import { useProModal } from '@/hooks/use-pro-modal'

const CodePage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt
      }
      const newMessages = [...messages, userMessage]

      const response = await axios.post('/api/code', { messages: newMessages })

      setMessages((current) => [...current, userMessage, response.data]) 
    } catch (error: any) {
      // TODO: OpenAI pro version
      if (error?.response?.status === 403) proModal.onOpen()
      else console.error(error)
    } finally {
      form.reset()
      router.refresh()
    }
  }

  return (
    <>
      <Heading 
        title="Code Generation" 
        description="Generate code from natural language."
        icon={Code} 
        iconColor="text-green-700" 
        bgColor="bg-green-700/10" 
      />

      <div className="px-4 lg:px-8">
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
                        placeholder="Simple toggle button using React Hooks."  
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

          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation yet." />
          )}

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div 
                key={`messages-${index}`} 
                className={cn(
                  "p-6 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown 
                  className="text-sm overflow-hidden leading-7"
                  components={{
                    pre: ({node, ...props}) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-3 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({node, ...props}) => (
                      <code className="bg-black/10 p-2" {...props} />
                    )
                  }}
                >
                  {message.content as string || ''}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default CodePage