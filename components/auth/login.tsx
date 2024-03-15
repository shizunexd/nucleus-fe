'use client'
import { Input, Button, FormControl } from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAuth } from '@/lib/auth'

export default function Login(props: any) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            let reqBody = JSON.stringify({
                username: username || undefined,
                password: password || undefined,
            })
            if (reqBody === '{}') {
                return
            }
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/login`, {
                method: 'POST',
                body: reqBody,
                headers: { 'content-type': 'application/json' },
            })
            let resJson = await res.json()
            if (res.status === 200) {
                setAuth(JSON.stringify(resJson.token))
                props.alertProps.setShowAlert(true)
                props.alertProps.setMessage('Login success!')
                props.alertProps.setSeverity('success')
                setTimeout(() => router.push(`/inventory`), 3000)
            } else if (res.status >= 500) {
                props.alertProps.setShowAlert(true)
                props.alertProps.setMessage('Server error.')
                props.alertProps.setSeverity('error')
            } else if (res.status >= 400 && res.status <= 499) {
                props.alertProps.setShowAlert(true)
                props.alertProps.setMessage(resJson.message)
                props.alertProps.setSeverity('error')
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <FormControl style={{ width: 'inherit' }}>
            <form style={{ display: 'contents' }}>
                <Input
                    type="text"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="text"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button onClick={handleSubmit}>{'Submit'}</Button>
            </form>
        </FormControl>
    )
}
