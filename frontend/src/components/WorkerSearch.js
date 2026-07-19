import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const WorkerSearch = ({ selected, onSelect, onRemove, placeholder = "Поиск сотрудников..." }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.length >= 1) {
                fetchResults();
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/workers/search?query=${encodeURIComponent(query)}`);
            setResults(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (worker) => {
        if (!selected.find(w => w.id === worker.id)) {
            onSelect(worker);
        }
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 1 && setIsOpen(true)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            {loading && <div style={{ position: 'absolute', right: '10px', top: '8px' }}>⏳</div>}

            {isOpen && results.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    padding: 0,
                    margin: 0,
                    listStyle: 'none'
                }}>
                    {results.map(worker => (
                        <li
                            key={worker.id}
                            onClick={() => handleSelect(worker)}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                            {worker.firstName} {worker.lastName} — {worker.email}
                        </li>
                    ))}
                </ul>
            )}

            {selected.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                    {selected.map(worker => (
                        <span key={worker.id} style={{
                            display: 'inline-block',
                            background: '#e0e0e0',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            marginRight: '4px',
                            marginBottom: '4px'
                        }}>
                            {worker.firstName} {worker.lastName}
                            <button
                                type="button"
                                onClick={() => onRemove(worker.id)}
                                style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkerSearch;