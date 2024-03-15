'use client'
import { useState, useEffect } from 'react'
import {
    FormControl,
    InputLabel,
    Input,
    Button,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    MenuItem,
    Typography,
    Checkbox,
    ListItemText,
} from '@mui/material'
import { getAuthHeaderValue } from '@/lib/auth'

export const RoutePermissions = {
    // Basic perms for inventory
    view: 'view',
    create: 'create',
    update: 'update',
    delete: 'delete',

    // Elevated perms for user and role management
    user: 'user',
    roles: 'roles',
}

export default function RoleEditor(props: any) {
    const [selectedPerms, setSelectedPerms] = useState<string[]>([])
    const [roleName, setRoleName] = useState('')

    const handleChange = (event: SelectChangeEvent<typeof selectedPerms>) => {
        const {
            target: { value },
        } = event
        setSelectedPerms(typeof value === 'string' ? value.split(',') : value)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            let reqBody = JSON.stringify({
                name: roleName,
                permissions: selectedPerms,
            })
            if (reqBody === '{}') {
                return
            }
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/upsert-role/`, {
                method: 'POST',
                body: reqBody,
                headers: {
                    'content-type': 'application/json',
                    authorization: getAuthHeaderValue(),
                },
            })
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
            // For unhandled errors
            console.log(err)
        }
    }

    return (
        <FormControl style={{ width: 'inherit' }}>
            <Typography variant="h6">Upsert Role Permissions:</Typography>
            <Typography variant="body2">
                If a Role with the given name does not exist, it will be created
            </Typography>
            <form style={{ display: 'contents' }}>
                <div>
                    <Input
                        type="text"
                        value={roleName}
                        placeholder="Role Name"
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                </div>

                <div>
                    <FormControl sx={{ m: 1, width: 300 }} size="small">
                        <InputLabel>Permissions</InputLabel>
                        <Select
                            multiple
                            value={selectedPerms}
                            onChange={handleChange}
                            input={<OutlinedInput label="Permissions" />}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {Object.keys(RoutePermissions).map((item: any) => (
                                <MenuItem key={item} value={item}>
                                    <Checkbox checked={selectedPerms.indexOf(item) > -1} />
                                    <ListItemText primary={item} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button variant="contained" onClick={handleSubmit}>
                    Update
                </Button>
            </form>
            <div></div>
        </FormControl>
    )
}
