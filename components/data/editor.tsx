'use client'
import { useState, useEffect } from 'react'
import { FormControl, InputLabel, Input, Button, Select, MenuItem } from '@mui/material'
import { useRouter } from 'next/navigation'
import { getAuthHeaderValue } from '@/lib/auth'

export default function ProductEditor(props: any) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [price, setPrice] = useState('')
    const [productType, setProductType] = useState('')
    const [supplier, setSupplier] = useState('')
    const [supplierList, setSupplierList] = useState<any[]>([])

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            let reqBody = JSON.stringify({
                name: name || undefined,
                description: description || undefined,
                release_date: releaseDate || undefined,
                price: Number(price) || undefined,
                type: productType || undefined,
                supplier_id: Number(supplier) || undefined,
            })
            if (reqBody === '{}') {
                return
            }
            let res = await fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/update-inventory/${props.productId}`,
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
                setName('')
                setDescription('')
                setPrice('')
                setProductType('')
                setSupplier('')
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

    const handleCreate = async (e: any) => {
        e.preventDefault()
        try {
            let reqBody = JSON.stringify({
                name: name || undefined,
                description: description || undefined,
                release_date: releaseDate || undefined,
                price: Number(price) || undefined,
                type: productType || undefined,
                supplier_id: Number(supplier) || undefined,
            })
            if (reqBody === '{}') {
                return
            }
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/add-inventory`, {
                method: 'POST',
                body: reqBody,
                headers: {
                    'content-type': 'application/json',
                    authorization: getAuthHeaderValue(),
                },
            })
            let resJson = await res.json()
            if (res.status === 200) {
                setName('')
                setDescription('')
                setPrice('')
                setProductType('')
                setSupplier('')
                props.alertProps.setShowAlert(true)
                props.alertProps.setMessage('Product Created, redirecting to new product page...')
                setTimeout(() => router.push(`/inventory/${resJson.data.id}`), 3000)
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

    const handleSelectSupplier = async (e: any) => {
        setSupplier(e.target.value as string)
    }

    async function fetchSuppliers() {
        await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/suppliers/`, {
            cache: 'no-store',
        })
            .then((res) => res.json())
            .then((data) => {
                setSupplierList(data.data)
            })
            .catch((err) => {})
    }
    useEffect(() => {
        fetchSuppliers()
    }, [])

    return (
        <FormControl style={{ width: 'inherit' }}>
            <form style={{ display: 'contents' }}>
                <Input
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    multiline
                    type="textarea"
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    type="date"
                    value={releaseDate}
                    placeholder="Release Date"
                    onChange={(e) => setReleaseDate(e.target.value)}
                />
                <Input
                    type="text"
                    value={price}
                    placeholder="Price"
                    onChange={(e) => setPrice(e.target.value)}
                />

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel>Product Type</InputLabel>
                    <Select
                        value={productType}
                        label="Product Type"
                        onChange={(e) => setProductType(e.target.value)}
                    >
                        <MenuItem value={'phone'}>Phone</MenuItem>
                        <MenuItem value={'tablet'}>Tablet</MenuItem>
                        <MenuItem value={'wearable'}>Wearable</MenuItem>
                    </Select>
                </FormControl>
                {/* <Input
                    type="text"
                    value={supplier}
                    placeholder="Supplier ID (visit /suppliers for a list of IDs)"
                    onChange={(e) => setSupplier(e.target.value)}
                /> */}

                <div>
                    <FormControl sx={{ m: 1, width: 300 }} size="small">
                        <InputLabel>Supplier ID</InputLabel>
                        <Select
                            value={supplierList.find((item) => item.id === supplier)}
                            onChange={handleSelectSupplier}
                            // input={<OutlinedInput label="Supplier" />}
                            label="Supplier ID"
                            renderValue={(selected) => selected}
                            // MenuProps={MenuProps}
                        >
                            {supplierList.map((item: any) => (
                                <MenuItem key={item.name} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button
                    variant="contained"
                    onClick={props.mode === 'create' ? handleCreate : handleSubmit}
                >
                    {props.mode === 'create' ? 'Create' : 'Update'}
                </Button>
            </form>
        </FormControl>
    )
}
