'use client'
import { Button } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { hasPermission } from '@/lib/auth'
import { useEffect, useState } from 'react'

export function CreateProductButton() {
    const [showCreate, setShowCreate] = useState(false)
    useEffect(() => {
        setShowCreate(hasPermission('create'))
    }, [])
    return (
        <>
            {showCreate && (
                <Button variant="outlined" href="/inventory/create" style={{ marginLeft: '10px' }}>
                    <NavigateNextIcon />
                    Create new product
                </Button>
            )}
            <p></p>
        </>
    )
}
