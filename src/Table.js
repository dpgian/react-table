import React, { useState } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'
import './Table.css'

export default function Table({ columns, data }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable({
        columns,
        data
        }, 
        useFilters,
        useSortBy
    )

    const [search, setSearch] = useState('')

    const handleSearch = e => {
        const value = e.target.value || undefined
        setFilter('show.name', search)
        setSearch(value)
    }

    return (
        <>  
            <span>
                Search: {'  '}
                <input 
                    value={search}
                    onChange={handleSearch}
                    placeholder='Search'
                    />
            </span>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} 
                                    className={
                                        column.isSorted ? column.isSortedDesc ? 'sort-desc' : 'sort-asc' : ''
                                    }>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )

}