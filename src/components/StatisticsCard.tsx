import React from 'react';
import { UrlStats } from '../types';

interface StatisticsCardProps {
  stats: UrlStats;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>URL Analytics Overview</h3>
        <p className="body2 text-secondary">
          Comprehensive statistics for your shortened URLs
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalClicks}</div>
          <div className="stat-label">Total Clicks</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.uniqueClicks}</div>
          <div className="stat-label">Unique Clicks</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.averageClicksPerDay.toFixed(1)}</div>
          <div className="stat-label">Avg. Clicks/Day</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.topReferrers.length}</div>
          <div className="stat-label">Top Referrers</div>
        </div>
      </div>

      <div className="grid grid-2 gap-3">
        <div>
          <h5 className="mb-2">Top Referrers</h5>
          <div className="p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            {stats.topReferrers.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.topReferrers.map((referrer, index) => (
                  <li key={index} className="body2 mb-1">
                    {index + 1}. {referrer}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="body2 text-secondary">No referrer data available</p>
            )}
          </div>
        </div>

        <div>
          <h5 className="mb-2">Top Countries</h5>
          <div className="p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            {stats.topCountries.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.topCountries.map((country, index) => (
                  <li key={index} className="body2 mb-1">
                    {index + 1}. {country}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="body2 text-secondary">No country data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h5 className="mb-2">Click Trend (Last 5 Days)</h5>
        <div className="p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          {stats.clickTrend.length > 0 ? (
            <div className="grid grid-5 gap-2">
              {stats.clickTrend.map((trend, index) => (
                <div key={index} className="text-center">
                  <div className="body2 text-secondary">{trend.date}</div>
                  <div className="h6 text-primary">{trend.clicks}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="body2 text-secondary">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard; 