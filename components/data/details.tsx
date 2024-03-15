'use client'
import Grid from '@mui/material/Unstable_Grid2'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Typography from '@mui/material/Typography'
import { Divider, Button } from '@mui/material'
import ProductEditor from '@/components/data/editor'
import ProductDeleteButton from '@/components/data/deleteProduct'
import EditIcon from '@mui/icons-material/Edit'
import { notFound } from 'next/navigation'
import { getAuthHeaderValue, hasPermission } from '@/lib/auth'
import { RoutePermissions } from '../auth/updateRole'

const formatter = new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
})
export default function ProductDetails(props: any) {
    const [isLoading, setLoading] = useState(true)
    const [showEditor, setShowEditor] = useState(false)
    const [data, setData] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    async function fetchData() {
        const headers = { authorization: getAuthHeaderValue() }
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/inventory/${props.params.productId}`, {
            cache: 'no-store',
            headers,
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.data)
                setLoading(false)
            })
            .catch((error) => {
                // For server related errors
                setLoading(false)
                setErrorMsg('Unable to establish a connection to the remote server.')
            })
    }
    useEffect(() => {
        fetchData()
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) {
        if (!errorMsg) {
            return notFound()
        } else {
            return <div>{errorMsg}</div>
        }
    }
    return (
        <div>
            {/* My Post: {props.params.productId} */}
            {/* <p>{JSON.stringify(data)}</p> */}
            <Typography variant="h4" gutterBottom noWrap>
                {(data as any).name}
            </Typography>
            <Grid container spacing={1}>
                <Grid
                    xs={6}
                    alignContent={'left'}
                    textAlign={'left'}
                    style={{
                        verticalAlign: 'top',
                        height: '80vh',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src={
                            (data as any).type === 'tablet'
                                ? '/ipad.jpeg'
                                : (data as any).type === 'wearable'
                                  ? '/smartwatch.jpeg'
                                  : '/redmi.jpeg'
                        }
                        fill
                        objectFit="contain"
                        objectPosition="top"
                        alt="Picture of the author"
                        style={{ verticalAlign: 'top' }}
                    ></Image>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="h5">Description</Typography>
                    <Typography variant="subtitle1" paragraph>
                        {(data as any).description}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Price: {formatter.format((data as any).price)}
                    </Typography>
                    <Typography variant="body1" paragraph gutterBottom>
                        Released on {(data as any).release_date}
                    </Typography>
                    <Typography variant="body1" paragraph gutterBottom>
                        Product Type: {(data as any).type}
                    </Typography>
                    <Divider />
                    <Typography variant="h5">Supplier information</Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {(data as any).supplier_id?.name} ({(data as any).supplier_id?.description})
                    </Typography>
                    <img
                        alt="logo"
                        src={`/suppliericons/${(data as any).supplier_id?.logo_url}`}
                    ></img>
                    <Typography variant="h6">Contact information</Typography>

                    <Typography>Phone: {(data as any).supplier_id?.phone}</Typography>
                    <Typography gutterBottom>
                        Address: {(data as any).supplier_id?.address}
                    </Typography>
                    {hasPermission(RoutePermissions.update) && (
                        <Typography onClick={() => setShowEditor(!showEditor)}>
                            <Button>
                                <EditIcon />
                                Toggle Product Editor
                            </Button>
                        </Typography>
                    )}
                    {hasPermission(RoutePermissions.update) && showEditor && (
                        <ProductEditor
                            alertProps={props.alertProps}
                            productId={props.params.productId}
                        ></ProductEditor>
                    )}
                    {hasPermission(RoutePermissions.delete) && (
                        <ProductDeleteButton
                            alertProps={props.alertProps}
                            productId={props.params.productId}
                        ></ProductDeleteButton>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}
