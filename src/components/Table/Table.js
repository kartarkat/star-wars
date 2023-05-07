import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


import './Table.css'
import { formatHeaderString, formatTableData } from '../../utils/helper';

const Table = ({ loading, people = [] }) => {
    const [tableData, setTableData] = useState([])
    const [sortDirections, setSortDirections] = useState({});

    const checkDetails = async (urls, dataType) => {
        if (urls && urls.length > 0) {
          const details = await Promise.all(
            urls.map(async (url) => {
              try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
              } catch (error) {
                console.log(error);
                return null;
              }
            })
          );
      
          return { [`${dataType}Details`]: details.filter((detail) => detail) };
        } else {
          return {};
        }
      };
      

      useEffect(() => {
        if (people && people.length > 0) {
          const checkSpecies = async (person) => {
            const speciesDetails = await checkDetails(person.species, "species");
            return { ...person, ...speciesDetails };
          };
      
          const checkHomeworld = async (person) => {
            const homeworldDetails = await checkDetails([person.homeworld], "homeworld");
            return { ...person, ...homeworldDetails };
          };
      
          const checkFilms = async (person) => {
            const filmDetails = await checkDetails(person.films, "films");
            return { ...person, ...filmDetails };
          };
      
          const checkVehicles = async (person) => {
            const vehicleDetails = await checkDetails(person.vehicles, "vehicles");
            return { ...person, ...vehicleDetails };
          };
      
          const checkStarships = async (person) => {
            const starshipDetails = await checkDetails(person.starships, "starships");
            return { ...person, ...starshipDetails };
          };
      
          Promise.all(
            people.map((person) =>
              Promise.all([
                checkSpecies(person),
                checkHomeworld(person),
                checkFilms(person),
                checkVehicles(person),
                checkStarships(person),
              ]).then((detailsArray) => Object.assign({}, ...detailsArray))
            )
          )
            .then((newTableData) => setTableData(newTableData))
            .catch((error) => console.log(error));
        }
      }, [people]);
      

    const handleSort = (header) => {
        const currentDirection = sortDirections[header];
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSortDirections({ ...sortDirections, [header]: newDirection });

        const sortedPeople = [...people].sort((a, b) => {
            const aVal = isNaN(a[header]) ? a[header] : Number(a[header]);
            const bVal = isNaN(b[header]) ? b[header] : Number(b[header]);
            if (!isNaN(aVal) && !isNaN(bVal)) {
                if (newDirection === 'asc') {
                    return aVal - bVal;
                } else {
                    return bVal - aVal;
                }
            }
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return newDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return 0;
        });

        setTableData(sortedPeople);
    };


    const renderTable = () => {
        const tableHeaders = Object.keys(tableData[0]) || []
        return (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {tableHeaders.map((header) => (
                                <th key={header}>{formatHeaderString(header)}
                                    <span onClick={() => handleSort(header)}>
                                        {sortDirections[header] === 'asc' ? ' ⬆️' : ' ⬇️'}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((person) => (
                            <tr key={person.id}>
                                {tableHeaders.map((header) => (
                                    <td key={`${person.id}-${header}`}>
                                        <div className="cell-content">
                                            {formatTableData(header, person[header])}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className='table-component'>
            {loading ? (
                <div className="loading">Loading data  <FontAwesomeIcon icon={faSpinner} spin /></div>
            ) : tableData.length === 0 ? (
                <div className="no-results">No results found from API</div>
            ) : (
                renderTable()
            )}
        </div>
    );
};

Table.propTypes = {
    loading: PropTypes.bool.isRequired,
    people: PropTypes.array.isRequired,
};

export default Table;
