import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your processed PDF documents and track extraction progress.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/upload"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Upload
        </Link>
      </div>
    </div>
  );
}
