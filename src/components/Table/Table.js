import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faMagnifyingGlass, faCircleInfo } from '@fortawesome/free-solid-svg-icons';


import './Table.css'
import { debounce, formatHeaderString, formatTableData, makeApiCall } from '../../utils/helper';
import Modal from '../Modal/Modal';
import PersonCard from '../PersonCard/PersonCard';

const Table = ({ loading, setLoading, people = [] }) => {
    const [tableData, setTableData] = useState([])
    const [sortDirections, setSortDirections] = useState({});
    const [searchUser, setSearchUser] = useState([])
    const [personsModal, setPersonsModal] = useState(false)
    const [infoModal, setInfoModal] = useState(false)


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
            setLoading(true)
            const checkSpecies = async (person) => {
                const speciesDetails = await checkDetails(person.species, "species");
                const name = person.name
                const gender = person.gender;
                let icon = null;

                if (gender === 'male' || gender === 'female') {
                    icon = 'human';
                }

                if (speciesDetails.speciesDetails && speciesDetails.speciesDetails.length > 0) {
                    const name = speciesDetails.speciesDetails[0]?.name;
                    icon = name;
                }

                return { name, icon, ...person, ...speciesDetails };
            };
            Promise.all(
                people.map((person) =>
                    Promise.all([
                        checkSpecies(person),
                    ]).then((detailsArray) => Object.assign({}, ...detailsArray))
                )
            )
                .then((newTableData) => { setTableData(newTableData); setLoading(false) })
                .catch((error) => { console.log(error); setLoading(false) });
        }
    }, [people, setLoading]);


    const handleSort = (header) => {
        const currentDirection = sortDirections[header];
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSortDirections({ ...sortDirections, [header]: newDirection });

        const sortedPeople = [...tableData].sort((a, b) => {
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
        const tableHeaders = tableData.length > 1 ? Object.keys(tableData[0]) : []
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

    const handleSearch = async (event) => {
        const query = event.target.value
        const res = await makeApiCall(`https://swapi.dev/api/people/?search=${query}`)
        await setPersonsModal(true)
        await setSearchUser(res.results)
    }

    const renderInfo = () => {
        const res = new Map();
        for (const d of tableData) {
            const { icon } = d;
            const count = res.has(icon) ? res.get(icon) + 1 : 1;
            res.set(icon, count);
        }
        const result = Array.from(res, ([icon, count]) => ({ icon, count }));
        return(
            <>
            {result.map(obj => <div>{obj.icon} : {obj.count}</div>)}
            </>
        )
    }


    return (
        <div className='table-component'>
            {loading || tableData.length === 0 ?
                <div className="loading">Loading data <FontAwesomeIcon icon={faSpinner} spin /></div>
                :
                <>
                    <div className='search-container'>
                        <FontAwesomeIcon className='info-icon' icon={faCircleInfo} onClick={() => setInfoModal(true)} />
                        <input
                            className='search-input'
                            onBlur={(event) => event.target.value = ''}
                            placeholder='search name'
                            onChange={debounce(handleSearch, 500)}
                        />
                        <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
                    </div>
                    {renderTable()}
                </>
            }
            <Modal isOpen={personsModal} onClose={() => setPersonsModal(false)}>
                <PersonCard persons={searchUser} />
            </Modal>
            <Modal isOpen={infoModal} onClose={() => setInfoModal(false)}>
                <div>
                    {renderInfo()}
                </div>
            </Modal>
        </div>
    );
};

Table.propTypes = {
    loading: PropTypes.bool.isRequired,
    people: PropTypes.array.isRequired,
};

export default Table;
