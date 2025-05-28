import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { X, Loader2 } from 'lucide-react';

const Sprint = (props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const startDate = new Date(props.sprint.start_date)
  const endDate = new Date(props.sprint.end_date)
  const queryClient = useQueryClient();
  const id = props.sprint.id
  const project_id = props.project_id
  
  console.log("Sprint project id: " + project_id)

  const deleteSprintMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`http://localhost:4000/api/sprint/${id}/${project_id}`);
      return response.data;
    },
    onSuccess: () => {
      console.log('Sprint deleted successfully');
      
      queryClient.invalidateQueries({ queryKey: ['sprints', project_id] });
      queryClient.invalidateQueries({ queryKey: ['sprints', String(project_id)] });
      queryClient.invalidateQueries({ queryKey: ['project', project_id] });
      queryClient.invalidateQueries({ queryKey: ['project', String(project_id)] });
      
      setShowConfirm(false);
    },
    onError: (error) => {
      console.error('Error deleting sprint:', error);
      alert('Failed to delete sprint. Please try again.');
      setShowConfirm(false);
    }
  });

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteSprintMutation.mutate();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const isDeleting = deleteSprintMutation.isPending;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200 relative">
      <div className="flex items-start justify-between">
        <a 
          href={`http://localhost:3000/dashbaord/manager/sprint/${props.sprint?.id}`}
          className="flex-1 group"
        >
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
            {props.sprint.name}
          </h3>
          <p className="text-xs text-gray-600">
            {startDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} - {endDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </a>

        <button 
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="ml-3 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded hover:bg-red-50"
          title="Delete sprint"
        >
          {isDeleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <X size={14} />
          )}
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center border-2 border-red-200 backdrop-blur-sm">
          <div className="text-center p-3">
            <p className="text-xs text-gray-700 mb-3">
              Delete "{props.sprint.name}"?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
              >
                {isDeleting && <Loader2 size={10} className="animate-spin" />}
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sprint