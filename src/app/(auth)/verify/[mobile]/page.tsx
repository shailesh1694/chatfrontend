"use client"

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifyUser } from '@/helper/axiosInstance'
import { requestApiHandler } from '@/helper/requestApiHandler'
import { useToast } from '@/hooks/use-toast'
import { ErrorType } from '@/interface/ErrorType'
import { codeVerifySchema } from '@/schemas/codeVerifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Verify = ({ params }: { params: { mobile: string } }) => {
    const [isVerifying, setIsVerifying] = useState<boolean>(false)
    const form = useForm<z.infer<typeof codeVerifySchema>>({ resolver: zodResolver(codeVerifySchema) })
    const { toast } = useToast()
    const router = useRouter();

    const onSubmit = (data: z.infer<typeof codeVerifySchema>) => {
        requestApiHandler(
            async () => await verifyUser(params.mobile, data.otp),
            setIsVerifying,
            (res) => {
                router.replace("/sign-in")
            },
            (error: ErrorType) => {
                toast({ title: "Code verification failed", description: error.message, variant: "destructive" })
            }
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="otp"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Input placeholder='Verification Code' {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isVerifying}>

                            {
                                isVerifying
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                    : "Verify"
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Verify