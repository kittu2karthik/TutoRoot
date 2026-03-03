import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

// Reusable Components
import ResultsHeader from '../components/Results/ResultsHeader';
import ResultsTable from '../components/Results/ResultsTable';

export default function Results() {
  const { id } = useParams();
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetchPairs();
  }, [id]);

  const fetchPairs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/uploads/${id}/pairs`);
      setPairs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (pair) => {
    setEditingId(pair.id);
    setEditForm({ question: pair.question, answer: pair.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (pairId) => {
    try {
      const res = await api.put(`/pairs/${pairId}`, editForm);
      setPairs(pairs.map((p) => (p.id === pairId ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to save edit', err);
      alert('Failed to save changes.');
    }
  };

  const handleDownload = async (type) => {
    try {
      const res = await api.get(`/exports/${id}/${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `upload_${id}_pairs.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.response && err.response.data instanceof Blob) {
        err.response.data
          .text()
          .then((text) => console.error(`Download failed: ${text}`));
      } else {
        console.error(`Failed to download ${type}`, err);
      }
      alert(
        `Failed to download ${type.toUpperCase()} file. Ensure you have the rights to view this upload.`
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Fetching Extractions...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in fade-in-0 duration-500 pb-12">
        {/* Render Extracted Components */}
        <ResultsHeader handleDownload={handleDownload} />

        <ResultsTable
          pairs={pairs}
          editingId={editingId}
          editForm={editForm}
          setEditForm={setEditForm}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
        />
      </div>
    </div>
  );
}
