import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { velocityCart } from '@/types/velocity';
import { useTheme } from 'next-themes';

interface VelocityChartProps {
   velocityData: velocityCart[];
}

interface SelectOption {
   value: string;
   label: string;
}

const VelocityChart: React.FC<VelocityChartProps> = ({velocityData}) => {
   const [dateRange, setDateRange] = useState<SelectOption>({ value: 'all', label: 'All Time' });
   const [hiddenSeries, setHiddenSeries] = useState<{[key: string]: boolean}>({});
   const { theme } = useTheme();

   const dateRangeOptions: SelectOption[] = [
       { value: 'all', label: 'All Time' },
       { value: 'last30', label: 'Last 30 Days' },
       { value: 'last90', label: 'Last 90 Days' },
       { value: 'last6months', label: 'Last 6 Months' },
       { value: 'lastyear', label: 'Last Year' }
   ];

   // React-select dark mode styles
   const selectStyles = {
       control: (provided: any) => ({
           ...provided,
           backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
           borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
           color: theme === 'dark' ? '#f9fafb' : '#111827',
           '&:hover': {
               borderColor: theme === 'dark' ? '#6b7280' : '#9ca3af',
           },
       }),
       menu: (provided: any) => ({
           ...provided,
           backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
           border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #d1d5db',
       }),
       option: (provided: any, state: any) => ({
           ...provided,
           backgroundColor: state.isFocused 
               ? (theme === 'dark' ? '#4b5563' : '#f3f4f6')
               : (theme === 'dark' ? '#374151' : '#ffffff'),
           color: theme === 'dark' ? '#f9fafb' : '#111827',
           '&:hover': {
               backgroundColor: theme === 'dark' ? '#4b5563' : '#f3f4f6',
           },
       }),
       singleValue: (provided: any) => ({
           ...provided,
           color: theme === 'dark' ? '#f9fafb' : '#111827',
       }),
   };

   const getFilteredData = () => {
       if (dateRange.value === 'all') {
           return velocityData;
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
               return velocityData;
       }

       return velocityData.filter(item => {
           const itemDate = new Date(item.endDate);
           return itemDate >= startDate;
       });
   };

   const filteredData = getFilteredData();

   filteredData.sort((a, b) => 
       new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
   );

   const chartData = filteredData.map((velocity) => ({
       sprintName: velocity.endDate,
       storyPoints: velocity.story_points_completed,
       sprintId: velocity.id || velocity.sprint_id,
       completedDate: new Date(velocity.endDate).toLocaleDateString()
   }));

   const CustomTooltip = ({ active, payload, label }: any) => {
       if (active && payload && payload.length) {
           const data = payload[0].payload;
           return (
               <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transition-colors duration-200">
                   <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                       Sprint: {data.completedDate}
                   </p>
                   <p className="text-blue-600 dark:text-blue-400 font-medium">
                       Story Points: {payload[0].value}
                   </p>
                   {data.sprintId && (
                       <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                           Sprint ID: {data.sprintId}
                       </p>
                   )}
               </div>
           );
       }
       return null;
   };

   const handleLegendClick = (entry: any) => {
       const { dataKey } = entry;
       setHiddenSeries(prev => ({
           ...prev,
           [dataKey]: !prev[dataKey]
       }));
   };

   const exportToCSV = () => {
       const csvData = filteredData.map(item => ({
           'Sprint End Date': new Date(item.endDate).toLocaleDateString(),
           'Story Points Completed': item.story_points_completed,
           'Sprint ID': item.id || item.sprint_id || 'N/A'
       }));

       const headers = Object.keys(csvData[0]);
       const csvContent = [
           headers.join(','),
           ...csvData.map(row => 
               headers.map(header => 
                   typeof row[header as keyof typeof row] === 'string' && 
                   (row[header as keyof typeof row] as string).includes(',') 
                   ? `"${row[header as keyof typeof row]}"` 
                   : row[header as keyof typeof row]
               ).join(',')
           )
       ].join('\n');

       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
       const link = document.createElement('a');
       const url = URL.createObjectURL(blob);
       link.setAttribute('href', url);
       link.setAttribute('download', `velocity-data-${dateRange.label.toLowerCase().replace(' ', '-')}.csv`);
       link.style.visibility = 'hidden';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(url);
   };

   if (!velocityData || velocityData.length === 0) {
       return (
           <div className="h-80 flex items-center justify-center">
               <div className="text-center">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                       <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                       </svg>
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No velocity data available</p>
               </div>
           </div>
       );
   }

   return (
       <div className="h-full">
           <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                       Velocity Trends
                   </h3>
                   <Select
                       value={dateRange}
                       onChange={(selectedOption) => {
                           if (selectedOption) {
                               setDateRange(selectedOption);
                           }
                       }}
                       options={dateRangeOptions}
                       isSearchable={false}
                       className="min-w-[200px]"
                       styles={selectStyles}
                   />
               </div>
               
               <Button 
                   onClick={exportToCSV}
                   variant="outline"
                   size="sm"
                   className="flex items-center gap-2"
                   disabled={filteredData.length === 0}
               >
                   <Download className="w-4 h-4" />
                   Export CSV
               </Button>
           </div>
           
           <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
                       <XAxis 
                           dataKey="sprintName" 
                           tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                           angle={-45}
                           textAnchor="end"
                           height={80}
                       />
                       <YAxis 
                           tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                           label={{ value: 'Story Points', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: theme === 'dark' ? '#d1d5db' : '#6b7280' } }}
                       />
                       <Tooltip content={<CustomTooltip />} />
                       <Legend 
                           onClick={handleLegendClick}
                           wrapperStyle={{ 
                               cursor: 'pointer',
                               paddingTop: '20px'
                           }}
                           iconType="line"
                       />
                       <Line 
                           type="monotone" 
                           dataKey="storyPoints" 
                           stroke={theme === 'dark' ? '#60a5fa' : '#3b82f6'}
                           strokeWidth={3}
                           dot={{ fill: theme === 'dark' ? '#60a5fa' : '#3b82f6', strokeWidth: 2, r: 6 }}
                           activeDot={{ r: 8, fill: theme === 'dark' ? '#3b82f6' : '#1d4ed8' }}
                           name="Story Points Completed"
                           hide={hiddenSeries.storyPoints}
                           connectNulls={false}
                       />
                   </LineChart>
               </ResponsiveContainer>
           </div>
       </div>
   )
}

export default VelocityChart