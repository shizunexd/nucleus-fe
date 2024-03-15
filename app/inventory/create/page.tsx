'use client'
import Markdown from '@/components/layout/markdown'
import ProductEditor from '@/components/data/editor'
import { Alert, AlertTitle } from '@mui/material'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import { hasPermission } from '@/lib/auth'
import { RoutePermissions } from '@/components/auth/updateRole'

export default function CreateInventory() {
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
    let mdContent = `# All fields are mandatory*`
    const errorContent = `# Something went wrong, please try again`
    if (!hasPermission(RoutePermissions.create)) {
        notFound()
    }
    return (
        <main>
            {showAlert && alertComponent}
            <Markdown className="markdown">{mdContent}</Markdown>
            <ProductEditor
                alertProps={{
                    setMessage: setMessage,
                    setSeverity: setSeverity,
                    setShowAlert: setShowAlert,
                }}
                mode="create"
            ></ProductEditor>
        </main>
    )
}
