import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import MaUTable from '@material-ui/core/Table'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TablePaginationActions from './TablePaginationActions'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableToolbar from './TableToolbar'
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, rest) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return(
            <>
                <Checkbox ref={resolvedRef} {...rest} />
            </>
        )
    }
)

const inputStyle = {
    padding: 0,
    margin: 0,
    border: 0,
    background: 'transparent'
}

const EditableCell = ({
    cell : { value: initialValue },
    row : { index },
    column : { id },
    updateMyData
}) => {
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }

    const onBlur = () => {
        updateMyData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <input
            style={inputStyle}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    )
}

EditableCell.propTypes = {
    cell: PropTypes.shape({
        value: PropTypes.any.isRequired
    }),
    row: propTypes.shape({
        index: PropTypes.number.isRequired
    }),
    column: propTypes.shape({
        id: PropTypes.number.isRequired
    }),
    updateMyData: PropTypes.func.isRequired
}

const defaultColumn = {
    Cell: EditableCell
}

const EnanchedTable = ({
    columns,
    data,
    setData,
    updateMyData,
    skipPageReset
}) => {
    const {
        getTableprops,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize, selectedRowIds, globalFilter }
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            autoResetPage: !skipPageReset,
            updateMyData
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.allColumns.push(columns => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleAllRowSelectedProps()} />
                        </div>
                    )
                },
                ...columns
            ])
        }
    )

    const handleChangePage = (event, newPage) => {
        gotoPage(newPage)
    }

    const handleChangeRowPerPage = (event) => {
        setPageSize(Number(event.target.value))
    }

    const removeByIndexs = (array, indexs) => array.filter((_, i) => !indexs.includes(i))
        
    const deleteUserHandler = event => {
        const newData = removeByIndexs(
            data,
            Object.keys(selectedRowIds).map(x => parseInt(x, 10))
        )
        setData(newData) 
    }
    
    const addUserHandler = user => {
        const newData = data.concat([user])
        setData(newData)
    }

    return (
        <TableContainer>
            <TableToolbar
            numSelected={Object.keys(selectedRowIds).length}
            deleteUserHandler={deleteUserHandler}
            addUserHandler={addUserHandler}
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
            />
            <MaUTable {...getTableprops()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell
                                {...(column.id === 'selection' 
                                    ? column.getHeaderProps()
                                    : column.getHeaderProps(column.getSortByToggleProps()))}
                                >
                                    {column.render('Headear')}
                                    {column.id !== 'selection' ? (
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                        />
                                    ) : null}
                                </TableCell>
                                ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>

                {/* <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[
                                5,
                                10,
                                20,
                                { label: 'All', value: data.length }
                            ]}
                            colSpan={3}
                            count={data.length}
                            rowsPerPage={pageSize}
                            page={pageIndex}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter> */}
            </MaUTable>
        </TableContainer>
    )
}

EnhancedTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    updateMyData: PropTypes.func.isRequired,
    setData: PropTypes.func.isRequired,
    skipPageReset: PropTypes.bool.isRequired,
  }
  
  export default EnhancedTable
  