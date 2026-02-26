'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { AuthCard, AuthInput, GoogleButton } from '@/components/features/auth/index'

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            console.error('Passwords do not match')
            return
        }
        const { confirmPassword, ...submitData } = formData
        console.log('Registration form data:', submitData)
    }

    const handleGoogleRegister = () => {
        console.log('Continue with Google clicked')
    }

    const passwordsMatch = formData.password === formData.confirmPassword
    const showPasswordError =
        formData.confirmPassword.length > 0 && !passwordsMatch

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <AuthCard title="Create Account">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    <div className="space-y-4 text-gray-700">
                        <AuthInput
                            id="name"
                            name="name"
                            type="text"
                            label="Full Name"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <AuthInput
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <AuthInput
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div>
                            <AuthInput
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={showPasswordError ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {showPasswordError && (
                                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={showPasswordError}
                            className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 font-medium transition-colors cursor-pointer"
                        >
                            Create Account
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

                    <GoogleButton onClick={handleGoogleRegister} />

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:text-primary-hover"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </div>
    )
}
