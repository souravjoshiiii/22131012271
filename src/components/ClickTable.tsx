import React, { useState } from 'react';
import { ClickData } from '../types';
import { formatDate, formatRelativeTime, truncateText } from '../utils/validation';

interface ClickTableProps {
  clicks: ClickData[];
}

const ClickTable: React.FC<ClickTableProps> = ({ clicks }) => {
  const [sortField, setSortField] = useState<keyof ClickData>('clickedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  const handleSort = (field: keyof ClickData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleDetails = (clickId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [clickId]: !prev[clickId]
    }));
  };

  const sortedClicks = [...clicks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: keyof ClickData) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (clicks.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Click Analytics</h3>
        </div>
        <div className="p-3 text-center">
          <p className="body1 text-secondary">No click data available yet.</p>
          <p className="body2 text-secondary">Clicks will appear here once people start using your shortened URLs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Click Analytics</h3>
        <p className="body2 text-secondary">
          Detailed click tracking and analytics ({clicks.length} clicks)
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer"
                onClick={() => handleSort('clickedAt')}
              >
                Time {getSortIcon('clickedAt')}
              </th>
              <th 
                className="cursor-pointer"
                onClick={() => handleSort('ipAddress')}
              >
                IP Address {getSortIcon('ipAddress')}
              </th>
              <th 
                className="cursor-pointer"
                onClick={() => handleSort('country')}
              >
                Location {getSortIcon('country')}
              </th>
              <th 
                className="cursor-pointer"
                onClick={() => handleSort('device')}
              >
                Device {getSortIcon('device')}
              </th>
              <th 
                className="cursor-pointer"
                onClick={() => handleSort('browser')}
              >
                Browser {getSortIcon('browser')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedClicks.map((click) => (
              <React.Fragment key={click.id}>
                <tr>
                  <td>
                    <div className="body2">
                      {formatRelativeTime(click.clickedAt)}
                    </div>
                    <div className="body2 text-secondary">
                      {formatDate(click.clickedAt)}
                    </div>
                  </td>
                  <td className="text-truncate">
                    {click.ipAddress}
                  </td>
                  <td>
                    <div className="body2">
                      {click.country}
                    </div>
                    {click.city && (
                      <div className="body2 text-secondary">
                        {click.city}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`btn btn-small ${click.device === 'Mobile' ? 'btn-primary' : 'btn-secondary'}`}>
                      {click.device}
                    </span>
                  </td>
                  <td>
                    <span className="btn btn-small btn-secondary">
                      {click.browser}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() => toggleDetails(click.id)}
                    >
                      {showDetails[click.id] ? 'Hide' : 'Show'} Details
                    </button>
                  </td>
                </tr>
                {showDetails[click.id] && (
                  <tr>
                    <td colSpan={6}>
                      <div className="fade-in p-2" style={{ 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        <div className="grid grid-2 gap-3">
                          <div>
                            <strong>User Agent:</strong>
                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                              {truncateText(click.userAgent, 100)}
                            </div>
                          </div>
                          <div>
                            <strong>Referrer:</strong>
                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                              {click.referrer || 'Direct'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <strong>Click ID:</strong> {click.id}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <div className="grid grid-4 gap-2 text-center">
          <div>
            <div className="h6 text-primary">
              {clicks.filter(c => c.device === 'Desktop').length}
            </div>
            <div className="body2 text-secondary">Desktop</div>
          </div>
          <div>
            <div className="h6 text-primary">
              {clicks.filter(c => c.device === 'Mobile').length}
            </div>
            <div className="body2 text-secondary">Mobile</div>
          </div>
          <div>
            <div className="h6 text-primary">
              {new Set(clicks.map(c => c.country)).size}
            </div>
            <div className="body2 text-secondary">Countries</div>
          </div>
          <div>
            <div className="h6 text-primary">
              {new Set(clicks.map(c => c.browser)).size}
            </div>
            <div className="body2 text-secondary">Browsers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickTable; 