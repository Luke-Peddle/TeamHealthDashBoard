import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Plus, Upload, X } from "lucide-react"

const VelocityUploader = ({project_id}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [data, setData] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadVelocityMutation = useMutation({
    mutationFn: async (records) => {
      const promises = records.map(async (record) => {
        const newVelocityRecord = {
          project_id: project_id,
          name: record.sprint_name,
          story_points: record.story_points_completed
        };
        console.log("project id: " + JSON.stringify(newVelocityRecord))
        return axios.post('http://localhost:4000/api/velocity', newVelocityRecord);
      });
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      setStatus({ type: 'success', message: 'Data uploaded successfully!' });
      setIsModalOpen(false);
      setData([]);
      
      queryClient.invalidateQueries({ queryKey: ['velocityMetrics', project_id] });
      queryClient.invalidateQueries({ queryKey: ['velocityMetrics', String(project_id)] });
      
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      setStatus({ type: 'error', message: 'Failed to upload data.' });
      
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
    }
  });

  const parseFile = async (event) => {
    const file = event.target.files[0];
    console.log("File: " + file)

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        setData(results.data);
        
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          alert(`Error parsing CSV: ${results.errors[0].message}`);
        }
      },
      error: function(error) {
        console.error('CSV parsing error:', error);
        alert(`Failed to parse CSV: ${error.message}`);
      }
    });
  }

  const addVelocityRecord = async () => {
    if (data.length === 0) return;
    uploadVelocityMutation.mutate(data);
  }

  const isLoading = uploadVelocityMutation.isPending;

  return (
    <div className="relative">
      <div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <Plus size={25}/>
          </svg>
          Import Velocity Data
        </button>
        
        {status.message && (
          <div className={`mt-2 p-2 rounded text-sm ${
            status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {status.message}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 md:mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Import Velocity Data</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={25} />
              </button>
            </div>
            
            <div className="w-full mb-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <Upload size={20} className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-xs text-gray-500">CSV files only</p>
                  </div>
                  <input 
                    id="dropzone-file" 
                    type="file" 
                    accept=".csv" 
                    onChange={parseFile} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
            
            {data.length > 0 && (
              <div className="mb-4 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{data.length}</span> records found in CSV
                </p>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={addVelocityRecord}
                disabled={data.length === 0 || isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${data.length === 0 || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Uploading...' : 'Upload Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VelocityUploader