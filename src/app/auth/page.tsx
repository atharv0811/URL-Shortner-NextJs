'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from '@/schemas/signInSchema'
import { signUpSchema } from '@/schemas/signUpSchema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from '@/components/ui/use-toast'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import * as z from 'zod'

const Auth = () => {
    const [activeTab, setActiveTab] = useState('signin')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const loginForm = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const registerForm = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    const handleLogin = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            toast({
                title: "Login failed",
                description: "Incorrect username or password",
                variant: "destructive"
            })
        }

        toast({
            title: "Success",
            description: "Login Successfull"
        })

        if (result?.url) {
            router.replace('/dashboard')
        }

        setIsSubmitting(false)
    }

    const handleRegister = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/auth/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })
            setIsSubmitting(false)
            setActiveTab("signin");

        } catch (error) {
            console.error("Error in signup of user", error)

            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })

            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-3xl font-bold mb-10">Login / Register</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Login</TabsTrigger>
                    <TabsTrigger value="signup">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...loginForm}>
                                <form
                                    onSubmit={loginForm.handleSubmit(handleLogin)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        name="identifier"
                                        control={loginForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="password"
                                        control={loginForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={isSubmitting}>
                                        {
                                            isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Please wait...
                                                </>
                                            ) : ('Login')
                                        }
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...registerForm}>
                                <form
                                    onSubmit={registerForm.handleSubmit(handleRegister)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        name="username"
                                        control={registerForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="username"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="email"
                                        control={registerForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="password"
                                        control={registerForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={isSubmitting}>
                                        {
                                            isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Please wait...
                                                </>
                                            ) : ('Register')
                                        }
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Auth
