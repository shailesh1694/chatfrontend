"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpUser } from '@/helper/axiosInstance'
import { requestApiHandler } from '@/helper/requestApiHandler'
import { useToast } from '@/hooks/use-toast'
import { ErrorType } from '@/interface/ErrorType'
import { signupValidation } from '@/schemas/signupSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SignUp = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const form = useForm<z.infer<typeof signupValidation>>({ resolver: zodResolver(signupValidation) })
  const router = useRouter();
  const { toast } = useToast()
  const submitHandler = (formdata: z.infer<typeof signupValidation>) => {

    requestApiHandler(
      async () => await signUpUser(formdata.username, formdata.mobile, formdata.email, formdata.password),
      setIsSubmitting,
      (res) => {
        router.replace('/verify/' + formdata.mobile)
      },
      (error: ErrorType) => {
        toast({ title: "Sign Up Failed !", variant: "destructive", description: error.message })
      }
    )
  }


  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join Chat App
          </h1>
          <p className="mb-4">Sign up to start chat !</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter user name" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
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
                  : "Sing Up"
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link onClick={(e)=> isSubmitting && e.preventDefault()} href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp