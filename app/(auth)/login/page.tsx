"use client";

import LoginForm from "../_components/loginForm";

export default function Login() {
    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="mt-1 text-sm text-foreground/70">Log in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
}