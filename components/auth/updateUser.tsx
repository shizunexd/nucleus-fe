'use client'
import { useState, useEffect } from 'react'
import { FormControl, InputLabel, Button, Select, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { getAuthHeaderValue } from '@/lib/auth'

export default function UserEditor(props: any) {
    const [user, setUser] = useState('')
    const [userList, setUserList] = useState<any[]>([])
    const [role, setRole] = useState('')
    const [roleList, setRoleList] = useState<any[]>([])

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            let reqBody = JSON.stringify({
                role: [Number(role)],
            })
            if (reqBody === '{}') {
                return
            }
            let res = await fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/update-user/${user}`,
                {
                    method: 'PATCH',
                    body: reqBody,
                    headers: {
                        'content-type': 'application/json',
                        authorization: getAuthHeaderValue(),
                    },
                }
            )
            let resJson = await res.json()
            if (res.status === 200) {
                props.alertProps.setShowAlert(true)
                props.alertProps.setMessage(
                    'Product Updated, refresh this page to see your changes.'
                )
                props.alertProps.setSeverity('success')
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

    async function fetchUsers() {
        await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/get-users/`, {
            cache: 'no-store',
            headers: { authorization: getAuthHeaderValue() },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserList(data.data)
            })
            .catch((err) => {})
    }
    async function fetchRoles() {
        await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/get-roles/`, {
            cache: 'no-store',
            headers: { authorization: getAuthHeaderValue() },
        })
            .then((res) => res.json())
            .then((data) => {
                setRoleList(data.data)
            })
            .catch((err) => {})
    }
    useEffect(() => {
        fetchUsers()
        fetchRoles()
    }, [])

    return (
        <FormControl style={{ width: 'inherit' }}>
            <Typography variant="h6">Update User Roles:</Typography>
            <form style={{ display: 'contents' }}>
                <div>
                    <FormControl sx={{ m: 1, width: 300 }} size="small">
                        <InputLabel>User ID</InputLabel>
                        <Select
                            value={userList?.find((item) => item.id === user)}
                            onChange={(e) => setUser(e.target.value as string)}
                            label="User ID"
                            renderValue={(selected) => selected}
                        >
                            {userList?.map((item: any) => (
                                <MenuItem key={item.username} value={item.id}>
                                    {item.username} - Current Role: {item.role[0]?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl sx={{ m: 1, width: 300 }} size="small">
                        <InputLabel>Role ID</InputLabel>
                        <Select
                            value={roleList?.find((item) => item.id === role)}
                            onChange={(e) => setRole(e.target.value as string)}
                            label="Role ID"
                            renderValue={(selected) => selected}
                        >
                            {roleList?.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name} - {item.permissions}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button variant="contained" onClick={handleSubmit}>
                    Update
                </Button>
            </form>
        </FormControl>
    )
}
