import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { logger } from '../utils/logger';

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        logger.info('Processing redirect', { shortCode });
        
        // Track the click first
        const clickResponse = await apiService.trackClick(shortCode);
        
        if (!clickResponse.success) {
          throw new Error(clickResponse.error || 'Failed to track click');
        }

        // Get the original URL
        const response = await apiService.getOriginalUrl(shortCode);
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'URL not found');
        }

        const { originalUrl } = response.data;
        
        logger.info('Redirecting to original URL', { shortCode, originalUrl });
        
        // Show redirecting state
        setRedirecting(true);
        
        // Redirect after a short delay to show the redirecting message
        setTimeout(() => {
          window.location.href = originalUrl;
        }, 1500);
        
      } catch (err) {
        logger.error('Redirect failed', { error: err, shortCode });
        setError(err instanceof Error ? err.message : 'Failed to process redirect');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (redirecting) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '100px auto' }}>
          <div className="spinner spinner-large" style={{ margin: '0 auto 24px' }}></div>
          <h3>Redirecting...</h3>
          <p className="body1 text-secondary">
            You are being redirected to the original URL.
          </p>
          <p className="body2 text-secondary mt-2">
            If you are not redirected automatically, please click the link below.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '100px auto' }}>
          <div className="spinner spinner-large" style={{ margin: '0 auto 24px' }}></div>
          <h3>Processing...</h3>
          <p className="body1 text-secondary">
            Please wait while we process your request.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '100px auto' }}>
          <div className="card-header">
            <h2 className="text-error">Redirect Failed</h2>
          </div>
          
          <div className="p-3">
            <div className="alert alert-error mb-3">
              <p className="body1">{error}</p>
            </div>
            
            <p className="body2 text-secondary mb-3">
              The shortened URL you're looking for could not be found or has expired.
            </p>
            
            <div className="flex gap-2 flex-wrap">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler; 