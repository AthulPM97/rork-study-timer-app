// Get today's date in YYYY-MM-DD format
export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Format date to display format (e.g., "May 26, 2025")
export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Check if a date is today
export const isToday = (dateString: string) => {
  return dateString === getTodayDateString();
};