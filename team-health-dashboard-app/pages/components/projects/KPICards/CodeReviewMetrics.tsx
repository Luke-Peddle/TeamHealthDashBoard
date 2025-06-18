import React from 'react'

interface codeMetrics{
    prReviewed: number
    avgReviewTime: number
}

const CodeReviewMetrics: React.FC<codeMetrics> = ({prReviewed, avgReviewTime}) => {
    console.log("PR reviews: " + prReviewed)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-sm dark:hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Code Review</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {prReviewed}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">PRs reviewed</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {avgReviewTime.toFixed(1)}h
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average review time</p>
                </div>
            </div>
        </div>
    )
}

export default CodeReviewMetrics