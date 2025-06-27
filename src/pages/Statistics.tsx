import React, { useState, useEffect } from 'react';
import StatisticsCard from '../components/StatisticsCard';
import ClickTable from '../components/ClickTable';
import { UrlStats, ClickData } from '../types';
import { apiService } from '../services/api';
import { logger } from '../utils/logger';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        logger.info('Loading URL statistics');
        
        // For demo purposes, we'll use a sample short code
        // In a real app, you might get this from URL params or user selection
        const sampleShortCode = 'abc123';
        
        const response = await apiService.getUrlStats(sampleShortCode);
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to load statistics');
        }

        setStats(response.data.stats);
        setClicks(response.data.clicks);
        
        logger.info('Statistics loaded successfully', { 
          totalClicks: response.data.stats.totalClicks 
        });
        
      } catch (err) {
        logger.error('Failed to load statistics', { error: err });
        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="flex-col-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner spinner-large mb-3"></div>
            <h3>Loading Statistics...</h3>
            <p className="body1 text-secondary">
              Please wait while we fetch your URL analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error mb-3">
          <h4>Error Loading Statistics</h4>
          <p className="body1">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container">
        <div className="text-center">
          <h2>URL Statistics</h2>
          <p className="body1 text-secondary">
            No statistics available. Create some shortened URLs first!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>URL Statistics</h1>
        <p className="body1 text-secondary">
          Track the performance of your shortened URLs
        </p>
      </div>

      <div className="grid grid-1 gap-4">
        <StatisticsCard stats={stats} />
        <ClickTable clicks={clicks} />
      </div>

      <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 className="mb-2">About Analytics</h4>
        <div className="grid grid-3 gap-3">
          <div>
            <h5 className="mb-1">Click Tracking</h5>
            <p className="body2 text-secondary">
              Every click on your shortened URLs is tracked with detailed analytics including location, device, and browser information.
            </p>
          </div>
          <div>
            <h5 className="mb-1">Real-time Data</h5>
            <p className="body2 text-secondary">
              Statistics are updated in real-time as users interact with your shortened URLs.
            </p>
          </div>
          <div>
            <h5 className="mb-1">Privacy Focused</h5>
            <p className="body2 text-secondary">
              We respect user privacy and only collect essential analytics data to help you understand your URL performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 