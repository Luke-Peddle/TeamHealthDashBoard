import React from 'react'

interface codeMetrics{
    prReviewed: number
    avgReviewTime: number
}

const CodeReviewMetrics: React.FC<codeMetrics> = ({prReviewed, avgReviewTime}) => {
    console.log("PR reviews: " + prReviewed)
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Code Review</h3>
                
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold text-gray-900">
                        {prReviewed}
                    </div>
                    <p className="text-sm text-gray-600">PRs reviewed</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                    <div className="text-lg font-semibold text-gray-700">
                        {avgReviewTime.toFixed(1)}h
                    </div>
                    <p className="text-sm text-gray-600">Average review time</p>
                </div>
            </div>
        </div>
    )
}

export default CodeReviewMetrics