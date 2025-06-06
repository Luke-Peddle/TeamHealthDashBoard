import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { pulseChartProps } from '@/types/PulseChart';
import Select from 'react-select';

interface PulseChartProps{
    pulses: pulseChartProps []
}
const PulseChart: React.FC<PulseChartProps> = ({ pulses }) => {
  const [dateRange, setDateRange] = useState({ value: 'all', label: 'All Time' });

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' }
  ];

  const getFilteredPulses = () => {
    if (!pulses || pulses.length === 0) return [];
    
    if (dateRange.value === 'all') {
      return pulses;
    }

    const now = new Date();
    let startDate;

    switch (dateRange.value) {
      case 'last30':
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last90':
        startDate = new Date();
        startDate.setDate(now.getDate() - 90);
        break;
      case 'last6months':
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'lastyear':
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return pulses;
    }

    return pulses.filter(pulse => {
      const pulseDate = new Date(pulse.day);
      return pulseDate >= startDate;
    });
  };

  const processedData = useMemo(() => {
    const filteredPulses = getFilteredPulses();
    if (!filteredPulses || filteredPulses.length === 0) return [];
    
    const groupedByDay = {};
    filteredPulses.forEach((pulse) => {
      const dateKey = new Date(pulse.day).toISOString().split('T')[0]; 
      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = [];
      }
      groupedByDay[dateKey].push(pulse);
    });
    
    const allDates = Object.keys(groupedByDay).sort();
    const allUsers = [...new Set(filteredPulses.map(pulse => pulse.username))];
    
    return allDates.map(dateStr => {
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const dayPulses = groupedByDay[dateStr] || [];
      const result = {
        date: formattedDate,
        fullDate: dateStr,
      };
      
     allUsers.forEach(username => {
        const userPulses = dayPulses.filter(pulse => pulse.username === username);
        if (userPulses.length > 0) {
          result[username] = userPulses.length === 1 
            ? userPulses[0].score 
            : Math.round((userPulses.reduce((sum, p) => sum + p.score, 0) / userPulses.length) * 10) / 10;
        } else {
          result[username] = null; 
        }
      });
      
      return result;
    });
  }, [pulses, dateRange]);

  const uniqueUsernames = useMemo(() => {
    const filteredPulses = getFilteredPulses();
    return [...new Set(filteredPulses.map(pulse => pulse.username))];
  }, [pulses, dateRange]);

  const userColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-sm">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-2">
            {uniqueUsernames.map(username => {
              const score = data[username];
              if (score !== null && score !== undefined) {
                return (
                  <div key={username} className="border-l-2 pl-2" style={{borderColor: userColors[uniqueUsernames.indexOf(username) % userColors.length]}}>
                    <p className="font-medium">{username}: {score}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!pulses || pulses.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        No pulse data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Select
          value={dateRange}
          onChange={setDateRange}
          options={dateRangeOptions}
          isSearchable={false}
        />
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={processedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {uniqueUsernames.map((username, index) => (
            <Area
              key={username}
              type="monotone"
              dataKey={username}
              stroke={userColors[index % userColors.length]}
              fill={userColors[index % userColors.length]}
              fillOpacity={0.3}
              strokeWidth={2}
              connectNulls={true} 
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PulseChart;