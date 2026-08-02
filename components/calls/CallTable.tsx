'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Edit2, Eye, Trash2 } from 'lucide-react';
import { Call } from '@/types';
import { formatDate, formatPhone, formatTime } from '@/lib/utils/formatters';
import { TEL_BASE, WHATSAPP_BASE } from '@/lib/utils/constants';
import StatusBadge, { WebsiteBadge } from '@/components/calls/StatusBadge';
import Dialog from '@/components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';

interface CallTableProps {
  calls: Call[];
  onDelete?: (id: string) => Promise<boolean>;
}

export default function CallTable({ calls, onDelete }: CallTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Call | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget || !onDelete) return;
    setIsDeleting(true);
    const success = await onDelete(deleteTarget._id);
    setIsDeleting(false);
    if (success) setDeleteTarget(null);
  };

  if (calls.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400 dark:text-zinc-600">
        <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-lg font-medium">No records found</p>
        <p className="text-sm">Add your first call to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-soft">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              {['Shop Name', 'Phone', 'Status', 'Website', 'Follow Up', 'Added By', 'Date', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-50 dark:divide-zinc-800">
            <AnimatePresence>
              {calls.map((call, i) => (
                <motion.tr
                  key={call._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <Link href={`/calls/${call._id}`} className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {call.shopName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`${TEL_BASE}${call.shopNumber}`} className="text-sm text-zinc-600 dark:text-zinc-400 font-mono hover:text-primary-600 dark:hover:text-primary-400">
                      {formatPhone(call.shopNumber)}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={call.callStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <WebsiteBadge discussed={call.websiteDiscussed} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {call.followUpDate ? (
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {formatDate(call.followUpDate)}
                        {call.followUpTime && <span className="text-zinc-400 ml-1">{formatTime(call.followUpTime)}</span>}
                      </span>
                    ) : (
                      <span className="text-zinc-300 dark:text-zinc-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {call.addedBy[0]}
                      </div>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{call.addedBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                    {formatDate(call.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`${TEL_BASE}${call.shopNumber}`}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`${WHATSAPP_BASE}${call.shopNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/50 text-[#25D366] transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/calls/${call._id}`}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/calls/${call._id}?edit=true`}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(call)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Record?"
        description={`This will permanently delete "${deleteTarget?.shopName}". This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
