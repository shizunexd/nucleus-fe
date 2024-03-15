'use client'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { getAuthHeaderValue } from '@/lib/auth'

import { GridDeleteForeverIcon } from '@mui/x-data-grid'

export default function ProductDeleteButton(props: any) {
    const router = useRouter()
    let handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            let res = await fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/delete-inventory/${props.productId}`,
                {
                    method: 'DELETE',
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
                    'Product Deleted, redirecting to product list page in 5 seconds...'
                )
                setTimeout(() => router.push('/inventory'), 5000)
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
        <Button onClick={handleSubmit}>
            <GridDeleteForeverIcon />
            Delete
        </Button>
    )
}
