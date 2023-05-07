import React, { useState } from 'react';
import './PersonCard.css';

const PersonCard = ({ persons = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentIndex < persons.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const person = persons[currentIndex] || {};
    const keys = Object.keys(person);

    const renderPersonData = () => {
        if (keys.length === 0) {
            return <div>No person found</div>;
        }

        return keys.map((key) => (
            <div key={key}>
                <strong>{key}: </strong>
                {Array.isArray(person[key]) ? person[key].join(', ') : person[key]}
            </div>
        ));
    };

    return (
        <div className='person-container'>
            {persons.length > 0 ? 
            <button className='navigate-btn' onClick={handlePrevClick} disabled={currentIndex === 0}>
                &lt;
            </button> : ''
            }
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">{person.name}</h2>
                </div>
                <div className="card-body">{renderPersonData()}</div>
            </div>
            {persons.length > 0 ? 
            <button className='navigate-btn' onClick={handleNextClick} disabled={currentIndex === persons.length - 1}>
                &gt;
            </button> : ""}
        </div>
    );
};

export default PersonCard;
