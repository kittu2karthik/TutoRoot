import React, { useEffect, useState, useMemo } from 'react';
import api from '../api';

// Reusable Components
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import StatCards from '../components/Dashboard/StatCards';
import UploadsTable from '../components/Dashboard/UploadsTable';

export default function Dashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc',
  });

  useEffect(() => {
    // Fetch actual data
    api
      .get('/uploads')
      .then((res) => {
        // Add a random ID to existing numeric DB IDs for a more professional look
        const formattedData = res.data.map((item) => ({
          ...item,
          displayId: `DOC-${Math.floor(Math.random() * 90000) + 10000}-${item.id}`,
        }));
        setUploads(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DOC-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const cleanFilename = (filename) => {
    if (!filename) return '';
    return filename.replace(/^\d+-/, '');
  };

  const filteredAndSortedUploads = useMemo(() => {
    let filtered = uploads.filter((upload) => {
      const search = searchTerm.toLowerCase();
      const idToSearch = upload.displayId || upload.id.toString();
      const cleanQ = cleanFilename(upload.question_pdf_filename).toLowerCase();
      const cleanA = cleanFilename(upload.answer_pdf_filename).toLowerCase();

      return (
        idToSearch.toLowerCase().includes(search) ||
        cleanQ.includes(search) ||
        cleanA.includes(search)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [uploads, searchTerm, sortConfig]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Dashboard Workspace...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in fade-in-0 duration-500 pb-12">
        {/* Render Reusable Dashboard Header */}
        <DashboardHeader />

        {/* Render Reusable Stat Cards */}
        <StatCards uploads={uploads} />

        {/* Render Reusable Uploads Table */}
        <UploadsTable
          filteredAndSortedUploads={filteredAndSortedUploads}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSort={handleSort}
        />
      </div>
    </div>
  );
}
