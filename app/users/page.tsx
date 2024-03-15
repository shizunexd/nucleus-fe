'use client'
import { Alert, AlertTitle } from '@mui/material'
import { useState, useEffect } from 'react'

import RoleEditor, { RoutePermissions } from '@/components/auth/updateRole'
import UserEditor from '@/components/auth/updateUser'
import { Divider } from '@mui/material'
import { hasPermission } from '@/lib/auth'
import { notFound } from 'next/navigation'

export default function UserManagement() {
    const [showUser, setShowUser] = useState(false)
    const [showRole, setShowRole] = useState(false)
    useEffect(() => {
        setShowUser(hasPermission(RoutePermissions.user))
        setShowRole(hasPermission(RoutePermissions.roles))
    }, [])

    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState(false)
    const [severity, setSeverity] = useState('success')
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

    if (!hasPermission(RoutePermissions.user) && !hasPermission(RoutePermissions.roles)) {
        notFound()
    }
    return (
        <>
            {showAlert && alertComponent}
            <div>
                {showUser && (
                    <UserEditor
                        alertProps={{
                            setMessage: setMessage,
                            setSeverity: setSeverity,
                            setShowAlert: setShowAlert,
                        }}
                    ></UserEditor>
                )}
                <p></p>
                <Divider />
                <p></p>
                {showRole && (
                    <RoleEditor
                        alertProps={{
                            setMessage: setMessage,
                            setSeverity: setSeverity,
                            setShowAlert: setShowAlert,
                        }}
                    ></RoleEditor>
                )}
            </div>
        </>
    )
}
