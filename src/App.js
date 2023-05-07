import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAndroid, faUserCircle, faQuestion, } from '@fortawesome/free-solid-svg-icons';
import Table from './components/Table/Table';
import Pagination from './components/Pagination/Pagination';

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

  const renderIcon = (person) => {
    if (person.species.length === 0) {
      if (person.gender === 'n/a') {
        return <FontAwesomeIcon icon={faMobileAndroid} />;
      }
      return <FontAwesomeIcon icon={faUserCircle} />;
    }
    return <FontAwesomeIcon icon={faQuestion} />;
  };

  return (
    <div className="container">
      <h1>Star Wars Characters</h1>
      <Table
        people={people}
        loading={loading}
        renderIcon={renderIcon} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;
