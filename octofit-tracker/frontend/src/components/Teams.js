import React, { useEffect, useMemo, useState } from 'react';
import { getApiEndpoint } from '../apiConfig';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [error, setError] = useState(null);
  const endpoint = getApiEndpoint('teams');

  useEffect(() => {
    console.log('Fetching Teams from:', endpoint);
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Teams fetch failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Teams fetched data:', data);
        const payload = Array.isArray(data) ? data : data.results ?? [];
        setTeams(payload);
      })
      .catch((fetchError) => {
        console.error('Teams fetch error:', fetchError);
        setError(fetchError.message);
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, [endpoint, reloadFlag]);

  const filteredTeams = useMemo(() => {
    if (!filter.trim()) {
      return teams;
    }
    return teams.filter((team) =>
      JSON.stringify(team).toLowerCase().includes(filter.toLowerCase())
    );
  }, [teams, filter]);

  const columns = teams.length ? Object.keys(teams[0]) : [];

  const renderCell = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return <pre className="mb-0 small">{JSON.stringify(value, null, 2)}</pre>;
    }
    return value.toString();
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h2 className="card-title h4">Teams</h2>
          <p className="card-text text-muted mb-0">
            Endpoint: <a href={endpoint} className="link-light" target="_blank" rel="noreferrer">{endpoint}</a>
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <button className="btn btn-outline-light me-2" onClick={() => setFilter('')}>Clear Filter</button>
          <button className="btn btn-light" onClick={() => setReloadFlag((current) => current + 1)}>Refresh</button>
        </div>
      </div>

      <div className="card-body">
        <form className="row g-3 mb-4">
          <div className="col-md-8">
            <label htmlFor="teamsFilter" className="form-label">
              Filter teams
            </label>
            <input
              id="teamsFilter"
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="form-control"
              placeholder="Search teams by any field"
            />
          </div>
        </form>

        {loading ? (
          <div className="alert alert-info">Loading teams...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredTeams.length ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, index) => (
                  <tr key={team.id ?? index}>
                    {columns.map((column) => (
                      <td key={column}>{renderCell(team[column])}</td>
                    ))}
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary" onClick={() => openModal(team)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-warning">No teams available.</div>
        )}
      </div>

      {showModal && selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
