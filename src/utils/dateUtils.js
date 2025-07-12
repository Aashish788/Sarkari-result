// Date utility functions for formatting dates consistently across the app

// Convert YYYY-MM-DD to DD-MM-YYYY format
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString || dateString === 'To be announced' || dateString === 'Before Exam' || dateString === 'Will be updated here soon') {
    return dateString;
  }
  
  try {
    // Handle both YYYY-MM-DD and existing DD-MM-YYYY formats
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      
      // If it's already in DD-MM-YYYY format, return as is
      if (parts[0].length === 2) {
        return dateString;
      }
      
      // If it's in YYYY-MM-DD format, convert to DD-MM-YYYY
      if (parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day}-${month}-${year}`;
      }
    }
    
    // Fallback: return original string
    return dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Convert DD-MM-YYYY to YYYY-MM-DD format (for database storage)
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString || dateString === 'To be announced' || dateString === 'Before Exam' || dateString === 'Will be updated here soon') {
    return null;
  }
  
  try {
    // Handle both DD-MM-YYYY and existing YYYY-MM-DD formats
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      
      // If it's already in YYYY-MM-DD format, return as is
      if (parts[0].length === 4) {
        return dateString;
      }
      
      // If it's in DD-MM-YYYY format, convert to YYYY-MM-DD
      if (parts[0].length === 2) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
      }
    }
    
    // Fallback: return original string
    return dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format date for display with proper labels
export const formatDateWithLabel = (dateString, label = '') => {
  const formattedDate = formatDateToDDMMYYYY(dateString);
  return formattedDate || 'To be announced';
};

// Check if date string is in valid DD-MM-YYYY format
export const isValidDDMMYYYYFormat = (dateString) => {
  if (!dateString) return false;
  
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  return dateRegex.test(dateString);
};

// Get current date in DD-MM-YYYY format
export const getCurrentDateDDMMYYYY = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

// Function to convert simple format to Date object for sorting (from searchService)
export const convertSimpleFormatToDate = (postTime) => {
  if (!postTime) return new Date(0);
  try {
    if (postTime.includes('/')) {
      const parts = postTime.split(' ');
      if (parts.length >= 3) {
        const datePart = parts[0];
        const timePart = parts[1];
        const ampm = parts[2];
        
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        
        let hour24 = parseInt(hours);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
        return date;
      }
    }
    return new Date(postTime);
  } catch (error) {
    console.error('Error converting date:', error);
    return new Date(0);
  }
};

// Sort function for consistent sorting like in search service
export const sortByDateConsistent = (items, primaryDateField = 'post_time', fallbackDateField = 'created_at') => {
  return items.sort((a, b) => {
    const dateA = convertSimpleFormatToDate(a[primaryDateField] || a[fallbackDateField]);
    const dateB = convertSimpleFormatToDate(b[primaryDateField] || b[fallbackDateField]);
    return dateB - dateA; // Most recent first
  });
};