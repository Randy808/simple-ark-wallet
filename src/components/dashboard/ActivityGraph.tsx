import React from 'react';

const ActivityGraph: React.FC = () => {
  // Mock data for the graph
  const data = [
    { day: 'Mon', value: 30 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 25 },
    { day: 'Thu', value: 60 },
    { day: 'Fri', value: 35 },
    { day: 'Sat', value: 20 },
    { day: 'Sun', value: 40 },
  ];

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Activity</h2>
        <div className="flex space-x-2">
          <button className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
            1W
          </button>
          <button className="text-xs font-medium px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-700">
            1M
          </button>
          <button className="text-xs font-medium px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-700">
            3M
          </button>
        </div>
      </div>
      
      <div className="h-48">
        <div className="flex h-40 items-end space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-md hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <div 
                  className="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-md h-1"
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityGraph;