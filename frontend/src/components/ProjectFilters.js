import React from 'react';

const ProjectFilters = ({ filters, setFilters, resetFilters }) => {
    return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <input
                type="date"
                value={filters.startDateFrom}
                onChange={(e) => setFilters({ ...filters, startDateFrom: e.target.value })}
                placeholder="Дата от"
            />
            <input
                type="date"
                value={filters.startDateTo}
                onChange={(e) => setFilters({ ...filters, startDateTo: e.target.value })}
                placeholder="Дата до"
            />
            <input
                type="number"
                value={filters.priorityFrom}
                onChange={(e) => setFilters({ ...filters, priorityFrom: e.target.value })}
                placeholder="Приоритет от"
            />
            <input
                type="number"
                value={filters.priorityTo}
                onChange={(e) => setFilters({ ...filters, priorityTo: e.target.value })}
                placeholder="Приоритет до"
            />
            <select
                value={filters.orderBy}
                onChange={(e) => setFilters({ ...filters, orderBy: e.target.value })}
            >
                <option value="name">По названию</option>
                <option value="startdate">По дате начала</option>
                <option value="priority">По приоритету</option>
            </select>
            <label>
                <input
                    type="checkbox"
                    checked={filters.descending}
                    onChange={(e) => setFilters({ ...filters, descending: e.target.checked })}
                />
                По убыванию
            </label>
            <button onClick={resetFilters}>Сбросить</button>
        </div>
    );
};

export default ProjectFilters;