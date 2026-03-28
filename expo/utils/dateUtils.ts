// Get today's date in YYYY-MM-DD format
export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Format date for display (e.g., "Today" or "May 27, 2025")
export const formatDisplayDate = (dateString: string) => {
  if (isToday(dateString)) {
    return "Today";
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Check if a date is today
export const isToday = (dateString: string) => {
  const today = getTodayDateString();
  return dateString === today;
};

// Format seconds to hours and minutes
export const formatTimeFromSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  
  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
};