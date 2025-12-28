
interface WeekData {
  week: string; // "YYYY-Www"
  count: number;
}

export interface SignupTrends {
  riders: WeekData[];
  drivers: WeekData[];
}

  export const formatPhone = (phone: string) => {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  };

  export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Utility function to format week string to readable date
export const formatWeekToDate = (weekString: string): string => {
  // Parse "2025-W46" to a readable format
  const [year, week] = weekString.split('-W');
  // Create a date from the first day of that week
  const simpleDate = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
  
  // Format: "MMM DD" or "Week W"
  return `Week ${week}`;
  // Alternative: return `${simpleDate.toLocaleDateString('default', { month: 'short' })} ${simpleDate.getDate()}`;
};


// Transform backend data to chart format
export const transformSignupData = (signupTrends: SignupTrends) => {
  if (!signupTrends?.riders || !signupTrends?.drivers) return [];

  const riders = signupTrends.riders;
  const drivers = signupTrends.drivers;
  
  // Ensure both arrays have the same weeks
  const allWeeks = [...new Set([
    ...riders.map(r => r.week),
    ...drivers.map(d => d.week)
  ])].sort()

  
  return allWeeks.map(week => {
    const riderData = riders.find(r => r.week === week);
    const driverData = drivers.find(d => d.week === week);
    
    return {
      week,
      formattedWeek: formatWeekToDate(week),
      riders: riderData?.count || 0,
      drivers: driverData?.count || 0,
      total: (riderData?.count || 0) + (driverData?.count || 0)
    };
  });
};
