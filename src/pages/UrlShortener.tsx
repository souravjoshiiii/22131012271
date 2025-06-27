import React, { useState, useEffect } from 'react';
import UrlForm from '../components/UrlForm';
import UrlCard from '../components/UrlCard';
import { CreateUrlRequest, ShortenedUrl } from '../types';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';

const UrlShortener: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load URLs from localStorage
    const savedUrls = storage.getShortenedUrls();
    setUrls(savedUrls);
  }, []);

  const handleSubmit = async (data: CreateUrlRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      logger.info('Creating shortened URL', { originalUrl: data.originalUrl });
      
      const response = await apiService.createShortUrl(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create shortened URL');
      }

      const newUrl = response.data;
      
      // Add to local state
      const updatedUrls = [...urls, newUrl];
      setUrls(updatedUrls);
      
      // Save to localStorage
      storage.saveShortenedUrls(updatedUrls);
      
      setSuccess(`URL shortened successfully! Your short URL is: ${newUrl.shortUrl}`);
      
      logger.info('URL shortened successfully', { 
        shortCode: newUrl.shortCode,
        shortUrl: newUrl.shortUrl 
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create shortened URL';
      setError(errorMessage);
      logger.error('Failed to create shortened URL', { error: err, data });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      logger.info('Deleting shortened URL', { id });
      
      const response = await apiService.deleteShortUrl(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete URL');
      }

      // Remove from local state
      const updatedUrls = urls.filter(url => url.id !== id);
      setUrls(updatedUrls);
      
      // Save to localStorage
      storage.saveShortenedUrls(updatedUrls);
      
      setSuccess('URL deleted successfully');
      
      logger.info('URL deleted successfully', { id });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete URL';
      setError(errorMessage);
      logger.error('Failed to delete URL', { error: err, id });
    }
  };

  const clearMessages = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>URL Shortener</h1>
        <p className="body1 text-secondary">
          Create short, memorable links for your long URLs
        </p>
      </div>

      {success && (
        <div className="alert alert-success mb-3">
          <p className="body1">{success}</p>
          <button 
            type="button" 
            className="btn btn-small btn-secondary mt-2"
            onClick={clearMessages}
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-3">
          <p className="body1">{error}</p>
          <button 
            type="button" 
            className="btn btn-small btn-secondary mt-2"
            onClick={clearMessages}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-2 gap-4">
        <div>
          <UrlForm onSubmit={handleSubmit} loading={loading} />
        </div>
        
        <div>
          <h3 className="mb-3">Recent URLs</h3>
          {urls.length === 0 ? (
            <div className="card text-center">
              <p className="body1 text-secondary">
                No shortened URLs yet. Create your first one!
              </p>
            </div>
          ) : (
            <div>
              {urls.map(url => (
                <UrlCard 
                  key={url.id} 
                  url={url} 
                  onDelete={handleDelete}
                />
              ))}
              
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all URLs?')) {
                      setUrls([]);
                      storage.clearShortenedUrls();
                      setSuccess('All URLs cleared');
                    }
                  }}
                >
                  Clear All URLs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 className="mb-2">How it works</h4>
        <div className="grid grid-3 gap-3">
          <div className="text-center">
            <div className="h5 text-primary mb-1">1. Paste URL</div>
            <p className="body2 text-secondary">
              Enter your long URL in the form above
            </p>
          </div>
          <div className="text-center">
            <div className="h5 text-primary mb-1">2. Get Short Link</div>
            <p className="body2 text-secondary">
              We'll create a short, memorable link for you
            </p>
          </div>
          <div className="text-center">
            <div className="h5 text-primary mb-1">3. Share & Track</div>
            <p className="body2 text-secondary">
              Share your link and track clicks in statistics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlShortener; 