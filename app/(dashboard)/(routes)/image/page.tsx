'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageIcon, Download, Terminal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { amountOptions, formSchema, resolutionOptions } from './constants'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'
import { Heading } from '@/components/heading'
import { Card, CardFooter } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const ConversationPage = () => {
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512'
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([])
      
      const response = await axios.post('/api/image', values)
      const urls     = response.data.map((image: {url: string}) => image.url)
      setImages(urls)
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
        title="Image Generation" 
        description="Turn your text into magic awesome images."
        icon={ImageIcon} 
        iconColor="text-pink-700" 
        bgColor="bg-pink-700/10" 
      />

      <div className="px-4 lg:px-8 pb-8">
        <Alert className="mb-3">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Apologies, the AI is experiencing technical difficulties. As an alternative, we're utilizing the non-AI to generate images.
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
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input 
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField 
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {amountOptions.map((option, index) => (
                          <SelectItem key={index} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField 
                name="resolution"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {resolutionOptions.map((option, index) => (
                          <SelectItem key={index} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <div className="p-20">
              <Loader />
            </div>
          )}

          {images.length === 0 && !isLoading && (
            <Empty label="No images generated yet." />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src, index) => (
              <Card
                key={index}
                className={cn('rounded-ld overflow-hidden')}
              >
                <div className={cn('relative aspect-square')}>
                  <Image 
                    alt={`Generated image ${index + 1}`}
                    fill
                    src={src}
                  />
                </div>

                <CardFooter className="p-2">
                  <Button 
                    variant={'secondary'} 
                    className={'w-full'}
                    onClick={() => window.open(src)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ConversationPage