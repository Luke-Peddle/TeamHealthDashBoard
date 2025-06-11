import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { velocityCart } from '@/types/velocity';

interface VelocityChartProps {
   velocityData: velocityCart[];
}

interface SelectOption {
   value: string;
   label: string;
}

const VelocityChart: React.FC<VelocityChartProps> = ({velocityData}) => {
   const [dateRange, setDateRange] = useState<SelectOption>({ value: 'all', label: 'All Time' });

   const dateRangeOptions: SelectOption[] = [
       { value: 'all', label: 'All Time' },
       { value: 'last30', label: 'Last 30 Days' },
       { value: 'last90', label: 'Last 90 Days' },
       { value: 'last6months', label: 'Last 6 Months' },
       { value: 'lastyear', label: 'Last Year' }
   ];

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
       sprintDate: velocity.endDate,
       sprintName: velocity.sprintName,
       storyPoints: velocity.story_points_completed,
       sprintId: velocity.id || velocity.sprint_id,
       completedDate: new Date(velocity.endDate).toLocaleDateString()
   }));

   const CustomTooltip = ({ active, payload, label }: any) => {
       if (active && payload && payload.length) {
           const data = payload[0].payload;
           console.log("Payload: " + JSON.stringify(data))
           return (
               <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                   <p className="font-semibold text-gray-800 mb-2">
                       {data.sprintName}
                   </p>
                   <p className="text-blue-600 font-medium">
                       Story Points: {payload[0].value}
                   </p>
                   
               </div>
           );
       }
       return null;
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

   return (
       <div className="h-full">
           <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
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
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis 
                           dataKey="sprintDate" 
                           tick={{ fontSize: 12, fill: '#6b7280' }}
                           angle={-45}
                           textAnchor="end"
                           height={80}
                       />
                       <YAxis 
                           tick={{ fontSize: 12, fill: '#6b7280' }}
                           label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }}
                       />
                       <Tooltip content={<CustomTooltip />} />
                      
                       <Line 
                           type="monotone" 
                           dataKey="storyPoints" 
                           stroke="#3b82f6" 
                           strokeWidth={3}
                           dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                           activeDot={{ r: 8, fill: '#1d4ed8' }}
                           name="Story Points Completed"
                           connectNulls={false}
                       />
                   </LineChart>
               </ResponsiveContainer>
           </div>

       </div>
   )
}

export default VelocityChart