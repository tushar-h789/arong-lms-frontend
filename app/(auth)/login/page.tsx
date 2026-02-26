'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { AuthCard, AuthInput, GoogleButton } from '@/components/features/auth/index'
import logo from '@/public/images/logo-bg.png'
import Image from 'next/image'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = { email, password }
        console.log('Login form data:', formData)
    }

    const handleGoogleLogin = () => {
        console.log('Continue with Google clicked')
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
            <AuthCard title="Login">
                <div className="flex flex-col items-center justify-center">
                    <Image src={logo} alt="Aarong Logo" width={120} height={120} />
                </div>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    <div className="space-y-4 text-gray-700">
                        <AuthInput
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <AuthInput
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2.5 font-medium transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <GoogleButton onClick={handleGoogleLogin} />

                    <p className="text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/registration"
                            className="font-medium text-primary hover:text-primary-hover"
                        >
                            Register
                        </Link>
                    </p>

                    {/* Role-based dashboard buttons – matches (dashboard)/dashboard structure */}
                    <div className="pt-4 space-y-3">
                        <p className="text-center text-sm text-gray-600">Or login as:</p>
                        <div className="grid grid-cols-3 gap-2">
                            <Link
                                href="/dashboard/admin"
                                className="w-full py-2.5 px-3 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-hover transition-colors duration-200 shadow hover:shadow-md text-center cursor-pointer"
                            >
                                Admin
                            </Link>
                            <Link
                                href="/dashboard/instructor"
                                className="w-full py-2.5 px-3 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-hover transition-colors duration-200 shadow hover:shadow-md text-center cursor-pointer"
                            >
                                Instructor
                            </Link>
                            <Link
                                href="/dashboard/learner"
                                className="w-full py-2.5 px-3 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-hover transition-colors duration-200 shadow hover:shadow-md text-center cursor-pointer"
                            >
                                Student
                            </Link>

                        </div>
                    </div>
                </form>
            </AuthCard>
        </div>
    )
}
