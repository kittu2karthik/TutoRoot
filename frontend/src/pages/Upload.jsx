import React, { useState } from 'react';
import { File, Upload as DropIcon } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (type === 'q') setQuestionFile(e.dataTransfer.files[0]);
      if (type === 'a') setAnswerFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'q') setQuestionFile(e.target.files[0]);
      if (type === 'a') setAnswerFile(e.target.files[0]);
    }
  };

  const handlePublish = async () => {
    if (!questionFile || !answerFile) {
      setError('Please provide both Question and Answer PDFs.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('questionPdf', questionFile);
    formData.append('answerPdf', answerFile);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/results/${res.data.uploadId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-8 animate-fade-in fade-in-0 duration-500 pb-12">
        {/* Header Section */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
            Extract Q&A from PDFs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload your question and answer documents to automatically generate
            interactive study pairs.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium text-center shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Questions PDF Zone */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center">
                <span>Questions PDF</span>
                {questionFile && (
                  <span className="text-emerald-500 flex items-center text-xs bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                    <File size={12} className="mr-1" />
                    Attached
                  </span>
                )}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all h-64 ${
                  questionFile
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                    : 'border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'q')}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'q')}
                />

                {questionFile ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full shadow-sm">
                      <File className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 px-4 truncate w-full max-w-[200px]">
                      {questionFile.name}
                    </p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-500">
                      {(questionFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 opacity-80">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-blue-500">
                      <DropIcon className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Drag & drop or browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
                      PDF files only (max. 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Answers PDF Zone */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center">
                <span>Answers PDF</span>
                {answerFile && (
                  <span className="text-emerald-500 flex items-center text-xs bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                    <File size={12} className="mr-1" />
                    Attached
                  </span>
                )}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all h-64 ${
                  answerFile
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                    : 'border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'a')}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'a')}
                />

                {answerFile ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full shadow-sm">
                      <File className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 px-4 truncate w-full max-w-[200px]">
                      {answerFile.name}
                    </p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-500">
                      {(answerFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 opacity-80">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-blue-500">
                      <DropIcon className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Drag & drop or browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
                      PDF files only (max. 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={isUploading || !questionFile || !answerFile}
              className="px-8 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Extracting Pairs...
                </>
              ) : (
                'Extract Data'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
