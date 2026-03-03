import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  FileText,
  Calendar,
  Clock,
  Eye,
} from 'lucide-react';

export default function UploadsTable({
  filteredAndSortedUploads,
  searchTerm,
  setSearchTerm,
  handleSort,
}) {
  const navigate = useNavigate();

  const cleanFilename = (filename) => {
    if (!filename) return '';
    return filename.replace(/^\d+-/, '');
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Uploads
          </h2>

          <div className="flex items-center space-x-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search IDs or files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white text-sm"
              />
            </div>

            <button
              onClick={() => handleSort('created_at')}
              className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
            >
              <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500" />
              Sort
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Document ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source Files
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredAndSortedUploads.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                      <p>No documents found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedUploads.map((upload) => (
                  <tr
                    key={upload.id}
                    onClick={() => navigate(`/results/${upload.id}`)}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all duration-200 group cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:shadow-sm"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                          {upload.displayId || upload.id || '#ERR'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {new Date(upload.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <FileText className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
                          <span
                            className="truncate max-w-[200px]"
                            title={cleanFilename(upload.question_pdf_filename)}
                          >
                            {cleanFilename(upload.question_pdf_filename)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <FileText className="w-4 h-4 mr-2 text-emerald-500 shrink-0" />
                          <span
                            className="truncate max-w-[200px]"
                            title={cleanFilename(upload.answer_pdf_filename)}
                          >
                            {cleanFilename(upload.answer_pdf_filename)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            upload.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${upload.status === 'Processing' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}
                          ></span>
                          {upload.status || 'Extracted'}
                        </span>

                        <Link
                          to={`/results/${upload.id}`}
                          className="opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-all focus:opacity-100"
                          title="View Extracted Data"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
