import React, { useEffect, useMemo, useState } from 'react';
import { getApiEndpoint } from '../apiConfig';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [error, setError] = useState(null);
  const endpoint = getApiEndpoint('activities');

  useEffect(() => {
    console.log('Fetching Activities from:', endpoint);
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Activities fetch failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Activities fetched data:', data);
        const payload = Array.isArray(data) ? data : data.results ?? [];
        setActivities(payload);
      })
      .catch((fetchError) => {
        console.error('Activities fetch error:', fetchError);
        setError(fetchError.message);
        setActivities([]);
      })
      .finally(() => setLoading(false));
  }, [endpoint, reloadFlag]);

  const filteredActivities = useMemo(() => {
    if (!filter.trim()) {
      return activities;
    }
    return activities.filter((activity) =>
      JSON.stringify(activity).toLowerCase().includes(filter.toLowerCase())
    );
  }, [activities, filter]);

  const columns = activities.length ? Object.keys(activities[0]) : [];

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
          <h2 className="card-title h4">Activities</h2>
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
            <label htmlFor="activityFilter" className="form-label">
              Filter activities
            </label>
            <input
              id="activityFilter"
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="form-control"
              placeholder="Search activities by any field"
            />
          </div>
        </form>

        {loading ? (
          <div className="alert alert-info">Loading activities...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredActivities.length ? (
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
                {filteredActivities.map((activity, index) => (
                  <tr key={activity.id ?? index}>
                    {columns.map((column) => (
                      <td key={column}>{renderCell(activity[column])}</td>
                    ))}
                    <td className="text-end">
                      <button className="btn btn-sm btn-primary" onClick={() => openModal(activity)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-warning">No activities available.</div>
        )}
      </div>

      {showModal && selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
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

export default Activities;
