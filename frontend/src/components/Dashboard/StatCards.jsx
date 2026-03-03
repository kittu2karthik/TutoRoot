import React from 'react';
import { Layers, Activity, Clock } from 'lucide-react';

export default function StatCards({ uploads }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
          <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Documents
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {uploads.length}
          </h3>
        </div>
      </div>
    </div>
  );
}
