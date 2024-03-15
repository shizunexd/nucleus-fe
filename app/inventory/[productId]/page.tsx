'use client'
import ProductDetails from '@/components/data/details'
import { useState } from 'react'
import { Alert, AlertTitle } from '@mui/material'

export default function InventoryDetail({ params }: { params: { productId: string } }) {
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
    return (
        <>
            {showAlert && alertComponent}
            <ProductDetails
                params={{
                    productId: params.productId,
                }}
                alertProps={{
                    setMessage: setMessage,
                    setSeverity: setSeverity,
                    setShowAlert: setShowAlert,
                }}
            ></ProductDetails>
        </>
    )
}
