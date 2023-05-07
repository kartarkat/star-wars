import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './components/Table/Table';
import Pagination from './components/Pagination/Pagination';
import './App.css'

const App = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let cancel;

    const fetchPeople = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${currentPage}`, {
          cancelToken: new axios.CancelToken(c => cancel = c)
        });
        const { count, results } = response.data;
        setPeople(results);
        setTotalPages(Math.ceil(count / 10));
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPeople();
    
    return () => {
      cancel();
    };
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <div className='title'>Star Wars Characters</div>
      <Table
        people={people}
        loading={loading}
        setLoading={setLoading}
        setPeople={setPeople} />
        {people.length > 0 ?
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          /> : ''
        }
    </div>
  );
}

export default App;
