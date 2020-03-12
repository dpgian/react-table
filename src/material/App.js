import React from 'react'
import axios from 'axios'

import CssBaseline from '@material-ui/core'
import EnanchedTable from './components/EnanchedTable'

const App = () => {
    // Stores data
    const [data, setData] = React.useState([])

    // Fetches data from API (jsonPlaceholder)
    React.useEffect(() => {
        (async () => {
          const result = await axios('https://jsonplaceholder.typicode.com/posts')
          setData(result.data)
        })()
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id'
            },
            {
                Header: 'First name',
                accessor: 'title'
            },
            {
                Header: 'Description',
                accessor: 'body'
            }
        ],
        []
    )
    
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    const updateMyData = ( rowIndex, columnId, value ) => {
        setSkipPageReset(true)
        setData(old =>
            old.map((row, index) => {
                if(index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value
                    }
                }
                return row
            })
        )
    }

    return (
        <>
            <CssBaseline />
            <EnanchedTable
                columns={columns}
                data={data}
                setData={setData}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
            />
        </>
    )
}

export default App