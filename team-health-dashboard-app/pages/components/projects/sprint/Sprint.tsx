import React from 'react'

const Sprint = (props) => {
  const startDate = new Date(props.sprint.start_date)
  const endDate = new Date(props.sprint.end_date)
    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
            <a 
                href={`http://localhost:3000/dashbaord/manager/sprint/${props.sprint?.id}`}
                className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
                Sprint #{props.sprint.id}
                <br/>
                {startDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'})}- {endDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'})}
            </a>
        </div>
    )
}

export default Sprint