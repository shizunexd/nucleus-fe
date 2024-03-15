'use client'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import { useSearchParams, notFound } from 'next/navigation'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50, sortable: false },
    {
        field: 'logo_url',
        headerName: 'Logo',
        width: 90,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, string>) => (
            <img src={`/suppliericons/${params.value}`}></img>
        ),
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        sortable: false,
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 150,
        sortable: false,
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 250,
        sortable: false,
    },
    {
        field: 'phone',
        headerName: 'Phone number',
        width: 150,
        sortable: false,
    },
]

const DefaultPageSize = 100

export default function SupplierTable(props: any) {
    const searchParams = useSearchParams()
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')

    async function fetchData(params: URLSearchParams) {
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/suppliers`, {
            cache: 'no-store',
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                setErrorMsg('Unable to establish a connection with the remote server.')
            })
    }

    useEffect(() => {
        fetchData(searchParams)
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
        <>
            <DataGrid
                rows={(data as any).map((supplier: any) => ({
                    ...supplier,
                }))}
                // rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: DefaultPageSize,
                        },
                    },
                }}
                pageSizeOptions={[DefaultPageSize]}
                disableColumnFilter={true}
                disableColumnMenu={true}
                disableColumnSelector={true}
                disableRowSelectionOnClick={true}
                filterMode={'server'}
                hideFooter={true}
            />
        </>
    )
}
