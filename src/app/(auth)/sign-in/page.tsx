"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInUser } from '@/helper/axiosInstance'
import { requestApiHandler } from '@/helper/requestApiHandler'
import { useToast } from '@/hooks/use-toast'
import { signinValidation } from '@/schemas/signinSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter();
  const form = useForm<z.infer<typeof signinValidation>>({ resolver: zodResolver(signinValidation), defaultValues: { mobile: "", password: "" } })
  const { toast } = useToast()

  const submitHandler = (formdata: z.infer<typeof signinValidation>) => {

    requestApiHandler(
      async () => await signInUser(formdata.mobile, formdata.password),
      setIsSubmitting,
      (res) => {
        router.replace('/')
      },
      (error: { message: string, success: boolean }) => {
        toast({
          title: "Login Failed !",
          variant: "destructive",
          description: error.message,
        })
      }
    )
  }


  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="mb-4">Sign in Chating is Waiting !</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter mobile number" type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                  : "Sign In"
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link onClick={(e)=> isSubmitting && e.preventDefault()} href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn