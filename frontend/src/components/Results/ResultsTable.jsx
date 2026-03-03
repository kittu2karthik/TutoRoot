import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ResultsTable({
  pairs,
  editingId,
  editForm,
  setEditForm,
  startEdit,
  cancelEdit,
  saveEdit,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E293B] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <Table className="relative w-full text-left border-collapse">
          <TableHeader className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[45%] px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Question
              </TableHead>
              <TableHead className="w-[45%] px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Answer
              </TableHead>
              <TableHead className="w-[10%] px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {pairs.map((pair) => {
              const isEditing = editingId === pair.id;

              return (
                <TableRow
                  key={pair.id}
                  className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors ${
                    pair.is_edited ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <TableCell className="align-top px-6 py-4">
                    {isEditing ? (
                      <textarea
                        className="flex min-h-[120px] w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                        value={editForm.question}
                        onChange={(e) =>
                          setEditForm({ ...editForm, question: e.target.value })
                        }
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-transparent dark:border-gray-800">
                        {pair.question}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="align-top px-6 py-4">
                    {isEditing ? (
                      <textarea
                        className="flex min-h-[120px] w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                        value={editForm.answer}
                        onChange={(e) =>
                          setEditForm({ ...editForm, answer: e.target.value })
                        }
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-transparent dark:border-gray-800">
                        {pair.answer || (
                          <span className="text-rose-500 dark:text-rose-400 font-medium italic flex items-center">
                            No answer matched in document
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right align-top px-6 py-4">
                    {isEditing ? (
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveEdit(pair.id)}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-500 dark:hover:bg-emerald-500/10 rounded-lg"
                          title="Save Changes"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
                          title="Cancel Editing"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(pair)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        title="Edit inline"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {pairs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      No generated pairs found
                    </p>
                    <p className="text-sm">
                      We couldn't extract any valid Question and Answer data
                      from this upload.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
