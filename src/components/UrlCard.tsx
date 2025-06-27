import React, { useState } from 'react';
import { ShortenedUrl } from '../types';
import { formatDate, formatRelativeTime } from '../utils/validation';
import { logger } from '../utils/logger';

interface UrlCardProps {
  url: ShortenedUrl;
  onDelete: (id: string) => void;
}

const UrlCard: React.FC<UrlCardProps> = ({ url, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      logger.info('URL copied to clipboard', { shortUrl: url.shortUrl });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error('Failed to copy URL', { error });
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url.shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVisit = () => {
    window.open(url.originalUrl, '_blank');
    logger.info('Original URL opened', { originalUrl: url.originalUrl });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this shortened URL?')) {
      onDelete(url.id);
      logger.info('URL deleted', { id: url.id, shortCode: url.shortCode });
    }
  };

  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <div className="url-card">
      <div className="url-original">
        <strong>Original:</strong> {url.originalUrl}
      </div>
      
      <div className="url-short">
        <strong>Short:</strong> {url.shortUrl}
      </div>
      
      <div className="flex flex-between mb-2">
        <div className="body2 text-secondary">
          <div>Clicks: {url.clickCount}</div>
          <div>Created: {formatRelativeTime(url.createdAt)}</div>
          {url.expiresAt && (
            <div className={isExpired ? 'text-error' : 'text-warning'}>
              Expires: {formatDate(url.expiresAt)}
              {isExpired && ' (Expired)'}
            </div>
          )}
        </div>
        
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {showDetails && (
        <div className="fade-in mt-2 p-2" style={{ 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <div><strong>Short Code:</strong> {url.shortCode}</div>
          <div><strong>ID:</strong> {url.id}</div>
          <div><strong>Status:</strong> {url.isActive ? 'Active' : 'Inactive'}</div>
          <div><strong>Created:</strong> {formatDate(url.createdAt)}</div>
          {url.expiresAt && (
            <div><strong>Expires:</strong> {formatDate(url.expiresAt)}</div>
          )}
        </div>
      )}

      <div className="url-actions">
        <button
          type="button"
          className={`btn ${copied ? 'btn-success' : 'btn-primary'} btn-small`}
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={handleVisit}
        >
          Visit
        </button>
        
        <button
          type="button"
          className="btn btn-error btn-small"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UrlCard; 