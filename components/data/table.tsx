'use client'
import { GridRowParams, DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
    Button,
    ButtonGroup,
    TablePagination,
    Typography,
    FormControl,
    FormControlLabel,
    Box,
    Card,
    CardContent,
    Divider,
    OutlinedInput,
    InputLabel,
    MenuItem,
    ListItemText,
    Slider,
    Checkbox,
    FormGroup,
} from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import FilterListIcon from '@mui/icons-material/FilterList'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { getAuthHeaderValue } from '@/lib/auth'

import { CreateProductButton } from './createProductButton'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, sortable: false },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        sortable: false,
    },
    {
        field: 'release_date',
        headerName: 'Release Date',
        width: 150,
        sortable: false,
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 150,
        sortable: false,
        valueGetter: (params) => {
            return `${formatter.format(params.row.price)}`
        },
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 150,
        sortable: false,
    },
    {
        field: 'logo_url',
        headerName: 'Supplier',
        width: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, string>) => (
            <img src={`/suppliericons/${params.row.supplier_id?.logo_url}`}></img>
        ),
    },
]
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const formatter = new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
})

const DefaultPageSize = 10

export default function ProductTable(props: any) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [total, setTotal] = useState(0)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(DefaultPageSize)
    const [sortfield, setSortfield] = useState('default')
    const [sortdir, setSortdir] = useState('asc')

    const [showFilters, setShowFilters] = useState(false)
    const [supplierList, setSupplierList] = useState<any[]>([])
    const [supplierOpts, setSupplierOpts] = useState<string[]>([])

    const handleChange = (event: SelectChangeEvent<typeof supplierOpts>) => {
        const {
            target: { value },
        } = event
        setSupplierOpts(typeof value === 'string' ? value.split(',') : value)
    }

    const [prices, setPrices] = useState<number[]>([0, 10000])
    const [productTypes, setProductTypes] = useState({
        phone: false,
        wearable: false,
        tablet: false,
    })

    const handleTypeChange = (event: any) => {
        setProductTypes({ ...productTypes, [event.target.name]: event.target.checked })
    }
    async function fetchData(params: URLSearchParams) {
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/inventory/?` + params, {
            cache: 'no-store',
            headers: { authorization: getAuthHeaderValue() as any },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status_code === 401) {
                    setErrorMsg(data.message)
                }
                setData(data.data)
                setTotal(data.count)
                setLoading(false)
            })
            .catch((err) => {
                // For server related errors
                setLoading(false)
                setErrorMsg('Unable to establish a connection to the remote server.')
            })
    }

    async function fetchSuppliers() {
        await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/suppliers/`, {
            cache: 'no-store',
        })
            .then((res) => res.json())
            .then((data) => {
                setSupplierList(data.data)
                if (searchParams.getAll('supplier').length) {
                    setSupplierOpts(
                        data.data.reduce((result: Array<string>, item: any) => {
                            if (searchParams.getAll('supplier').includes(item.id.toString())) {
                                result.push(item.name)
                            }
                            return result
                        }, [])
                    )
                }
            })
            .catch((err) => {})
    }

    const handleChangeSort = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedVal = (event.target as HTMLInputElement).value
        setSortfield(updatedVal)
        const params = new URLSearchParams(searchParams)
        if (updatedVal !== 'default') {
            params.set('sortby', updatedVal)
            params.set('sort', sortdir)
        } else {
            params.delete('sortby')
            params.delete('sort')
        }
        router.push(pathname + '?' + params)
        setLoading(true)
        fetchData(params)
    }

    const handleChangeSortDir = () => {
        const nextSortDir = sortdir === 'asc' ? 'desc' : 'asc'
        setSortdir(nextSortDir)
        const params = new URLSearchParams(searchParams)
        if (sortfield !== 'default') {
            params.set('sortby', sortfield)
            params.set('sort', nextSortDir)
            router.push(pathname + '?' + params)
            setLoading(true)
            fetchData(params)
        } else {
            params.delete('sortby')
            params.delete('sort')
        }
    }

    const handleChangePrice = (event: Event, newValue: number | number[]) => {
        setPrices(newValue as number[])
    }
    const handleSearch = () => {
        const params = new URLSearchParams(searchParams)
        setPage(0)
        params.delete('page')

        if (prices[0] > 0) {
            params.set('priceMin', prices[0].toString())
        } else {
            params.delete('priceMin')
        }
        if (prices[1] > 0) {
            params.set('priceMax', prices[1].toString())
        } else {
            params.delete('priceMax')
        }
        Object.keys(productTypes).forEach((productType: string) => {
            if ((productTypes as any)[productType]) {
                if (!params.getAll('type').includes(productType)) {
                    params.append('type', productType)
                }
            } else {
                params.delete('type', productType)
            }
        })
        if (supplierOpts.length) {
            params.delete('supplier')
            supplierOpts.forEach((name) => {
                const supplierObject = supplierList.find((e) => {
                    return e.name === name
                })
                if (supplierObject && !params.getAll('supplier').includes(supplierObject.id)) {
                    params.append('supplier', supplierObject.id)
                }
            })
        }
        router.push(pathname + '?' + params)
        setLoading(true)
        fetchData(params)
    }

    const pageRange = (total: number, itemsPerPage: number) => {
        const maxPage = Math.ceil(total / itemsPerPage)
        return Array.from(Array(maxPage).keys())
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage)
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        router.push(pathname + '?' + params)
        setLoading(true)
        fetchData(params)
    }

    const handlePageJump = (e: any) => {
        handleChangePage(null, e.target.value)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
        const params = new URLSearchParams(searchParams)
        params.set('page', (0).toString())
        params.set('itemsPerPage', parseInt(event.target.value, 10).toString())
        router.push(pathname + '?' + params)
        setLoading(true)
        fetchData(params)
    }

    const handleRowClick = (
        params: GridRowParams
        // event, // MuiEvent<React.MouseEvent<HTMLElement>>
        // details // GridCallbackDetails
    ) => {
        router.push(pathname + '/' + params.id)
    }

    useEffect(() => {
        if (Number(searchParams.get('page'))) {
            setPage(Number(searchParams.get('page')))
        }
        if (Number(searchParams.get('itemsPerPage'))) {
            setRowsPerPage(Number(searchParams.get('itemsPerPage')))
        }
        if (searchParams.get('sortby')) {
            setSortfield(searchParams.get('sortby') || 'default')
        }
        if (searchParams.getAll('type')) {
            const queryTypes = {
                phone: false,
                wearable: false,
                tablet: false,
            }
            Object.keys(productTypes).forEach((type) => {
                ;(queryTypes as any)[type] = searchParams.getAll('type').includes(type)
            })
            setProductTypes(queryTypes)
        }
        fetchData(searchParams)
        fetchSuppliers()
    }, [])

    return (
        <>
            <div>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setShowFilters(!showFilters)
                    }}
                >
                    <FilterListIcon />
                    Show filters
                </Button>
                <CreateProductButton></CreateProductButton>
                {showFilters && (
                    <div
                        style={{
                            // width: '100%',
                            zIndex: 999,
                            // justifyContent: 'center',
                            position: 'absolute',
                        }}
                    >
                        <Box sx={{ minWidth: 575 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <FormControl style={{ width: '80%' }}>
                                        <Typography>Price:</Typography>
                                        <Typography>
                                            {`Min:${prices[0]}, Max: ${prices[1]}`}
                                        </Typography>
                                        <form style={{ display: 'contents' }}>
                                            <Slider
                                                min={0}
                                                max={10000}
                                                step={100}
                                                onChange={handleChangePrice}
                                                value={prices}
                                            />
                                            <Divider />
                                            <Typography>Type:</Typography>
                                            <FormGroup row>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={productTypes.phone}
                                                            onChange={handleTypeChange}
                                                            name="phone"
                                                        />
                                                    }
                                                    label="Phone"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={productTypes.tablet}
                                                            onChange={handleTypeChange}
                                                            name="tablet"
                                                        />
                                                    }
                                                    label="Tablet"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={productTypes.wearable}
                                                            onChange={handleTypeChange}
                                                            name="wearable"
                                                        />
                                                    }
                                                    label="Wearable"
                                                />
                                            </FormGroup>
                                            <Divider />
                                            <div>
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel>Supplier</InputLabel>
                                                    <Select
                                                        multiple
                                                        value={supplierOpts}
                                                        onChange={handleChange}
                                                        input={<OutlinedInput label="Supplier" />}
                                                        renderValue={(selected) =>
                                                            selected.join(', ')
                                                        }
                                                        MenuProps={MenuProps}
                                                    >
                                                        {supplierList.map((item: any) => (
                                                            <MenuItem
                                                                key={item.name}
                                                                value={item.name}
                                                            >
                                                                <Checkbox
                                                                    checked={
                                                                        supplierOpts.indexOf(
                                                                            item.name
                                                                        ) > -1
                                                                    }
                                                                />
                                                                <ListItemText primary={item.name} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>

                                            <Button onClick={handleSearch}>Search</Button>
                                        </form>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Box>
                    </div>
                )}
            </div>
            <div>
                <RadioGroup row name="row-radio-buttons-group" onChange={handleChangeSort}>
                    <Typography variant="body1" style={{ margin: 'revert', paddingRight: '10px' }}>
                        Sort by:
                    </Typography>

                    {[
                        { name: 'default', label: 'Default (None)' },
                        { name: 'type', label: 'Type' },
                        { name: 'release_date', label: 'Release Date' },
                        { name: 'price', label: 'Price' },
                    ].map((prop) => {
                        return (
                            <FormControlLabel
                                key={prop.name}
                                checked={sortfield === prop.name}
                                value={prop.name}
                                control={<Radio />}
                                label={prop.label}
                            />
                        )
                    })}
                </RadioGroup>
                <ButtonGroup
                    variant="contained"
                    style={{ display: sortfield === 'default' ? 'none' : undefined }}
                >
                    <Button onClick={handleChangeSortDir}>
                        <SwapVertIcon /> Sort {sortdir}
                    </Button>
                </ButtonGroup>
            </div>
            {isLoading && <p>Loading...</p>}
            {!isLoading && !data && <p>Failed to fetch. {errorMsg}</p>}
            {!isLoading && data && (
                <>
                    <DataGrid
                        rows={(data as any).map((product: any) => ({
                            ...product,
                        }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: rowsPerPage,
                                },
                            },
                        }}
                        pageSizeOptions={[rowsPerPage]}
                        disableColumnFilter={true}
                        disableColumnMenu={true}
                        disableColumnSelector={true}
                        disableRowSelectionOnClick={true}
                        filterMode={'server'}
                        hideFooter={true}
                        onRowClick={handleRowClick}
                    />
                    <Box>
                        <div>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>Jump to Page</InputLabel>
                                <Select
                                    value={Array.from(Array(page).keys()).map((pageNum) => {
                                        return pageNum.toString()
                                    })}
                                    onChange={handlePageJump}
                                    input={<OutlinedInput label="Jump to Page" />}
                                    MenuProps={MenuProps}
                                    renderValue={() => {
                                        return page
                                    }}
                                >
                                    {pageRange(total, rowsPerPage).map((pageNum) => (
                                        <MenuItem key={pageNum} value={pageNum}>
                                            <ListItemText primary={pageNum}>{page}</ListItemText>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[10, 20, 100]}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </Box>
                </>
            )}
        </>
    )
}
