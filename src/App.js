import React, { useMemo, useState, useEffect} from 'react';
import axios from 'axios';

import Table from './Table'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      const result = await axios('https://api.tvmaze.com/search/shows?q=snow')
      setData(result.data)
    })()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'TV show',
        columns: [
          {
            Header: 'Name',
            accessor: 'show.name'
          }
        ]
      },
      {
        Header: 'Details',
        columns: [
          {
            Header: 'Language',
            accessor: 'show.language'
          },
          {
            Header: 'Genre(s)',
            accessor: 'show.genres'
          },
          {
            Header: 'Runtime',
            accessor: 'show.runtime',
            Cell: ({ cell: { value } }) => {
              const hour = Math.floor(value / 60);
              const min = Math.floor(value % 60);
              return (
                <>
                  {hour > 0 ? `${hour} hr${hour > 1 ? "s" : ""} ` : ""}
                  {min > 0 ? `${min} min${min > 1 ? "s" : ""}` : ""}
                </>
              );
            }
          },
          {
            Header: 'Status',
            accessor: 'show.status'
          }
        ]
      }
    ],
    []
  )

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
