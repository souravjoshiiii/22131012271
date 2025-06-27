import { ValidationResult, FormErrors } from '../types';

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateShortCode = (shortCode: string): boolean => {
  // Short code should be 3-20 characters, alphanumeric and hyphens only
  const shortCodeRegex = /^[a-zA-Z0-9-]{3,20}$/;
  return shortCodeRegex.test(shortCode);
};

export const validateExpiryDate = (date: string): boolean => {
  const expiryDate = new Date(date);
  const now = new Date();
  return expiryDate > now;
};

export const validateUrlForm = (data: {
  originalUrl: string;
  customShortCode?: string;
  expiresAt?: string;
}): ValidationResult => {
  const errors: FormErrors = {};

  // Validate original URL
  if (!data.originalUrl.trim()) {
    errors.originalUrl = 'URL is required';
  } else if (!validateUrl(data.originalUrl)) {
    errors.originalUrl = 'Please enter a valid URL (must start with http:// or https://)';
  }

  // Validate custom short code if provided
  if (data.customShortCode && data.customShortCode.trim()) {
    if (!validateShortCode(data.customShortCode)) {
      errors.customShortCode = 'Short code must be 3-20 characters, alphanumeric and hyphens only';
    }
  }

  // Validate expiry date if provided
  if (data.expiresAt && data.expiresAt.trim()) {
    if (!validateExpiryDate(data.expiresAt)) {
      errors.expiresAt = 'Expiry date must be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const generateShortCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 