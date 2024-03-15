'use client'
import Markdown from '@/components/layout/markdown'
import ProductEditor from '@/components/data/editor'
import { Alert, AlertTitle, Input, Button, FormControl } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Login from '@/components/auth/login'

import { setAuth, getAuth, clearAuth } from '@/lib/auth'

export default function LoginPage() {
    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('success')

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const router = useRouter()

    const alertComponent = (
        <div
            style={{
                width: '100%',
                zIndex: 999,
                justifyContent: 'center',
                position: 'absolute',
            }}
        >
            <Alert
                severity={severity as any}
                style={{ margin: 'auto', minWidth: '500px', maxWidth: '30%' }}
                onClose={() => {
                    setShowAlert(false)
                }}
            >
                <AlertTitle style={{ textTransform: 'capitalize' }}>{severity}</AlertTitle>
                {message}
            </Alert>
        </div>
    )
    let mdContent = `# All fields are mandatory*`
    const errorContent = `# Something went wrong, please try again`
    const alreadyLoggedIn = `# You are already logged in, please log out first`

    useEffect(() => {
        setIsLoggedIn(!!getAuth())
    }, [])

    if (isLoggedIn) {
        return (
            <main>
                <Markdown>{alreadyLoggedIn}</Markdown>
                <Button
                    onClick={() => {
                        clearAuth()
                        router.push('/')
                        // router.refresh()
                        console.log('refrehsed')
                    }}
                >
                    Logout
                </Button>
            </main>
        )
    }
    return (
        <main>
            {showAlert && alertComponent}
            <Markdown>{mdContent}</Markdown>
            <Login
                alertProps={{
                    setMessage: setMessage,
                    setSeverity: setSeverity,
                    setShowAlert: setShowAlert,
                }}
            ></Login>
        </main>
    )
}
