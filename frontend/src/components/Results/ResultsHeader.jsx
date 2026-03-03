import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResultsHeader({ handleDownload }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="mr-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Link to="/dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Extracted Results
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review, export your generated Q&A pairs
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => handleDownload('csv')}
          className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" /> CSV Export
        </Button>
        <Button
          onClick={() => handleDownload('html')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4 mr-2" /> HTML Export
        </Button>
      </div>
    </div>
  );
}
