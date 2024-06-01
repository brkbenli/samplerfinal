import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div
            id="pagination"
            style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                marginTop: '20px'
            }}
        >
            <button 
                onClick={handlePrev} 
                disabled={currentPage === 1}
                style={{
                    border: '2px solid white',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    backgroundColor: 'black',
                    color: 'white',
                    cursor: 'pointer',
                    marginRight: '10px'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'black';
                    e.target.style.color = 'white';
                }}
            >
                Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
                style={{
                    border: '2px solid white',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    backgroundColor: 'black',
                    color: 'white',
                    cursor: 'pointer',
                    marginLeft: '10px'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'black';
                    e.target.style.color = 'white';
                }}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;