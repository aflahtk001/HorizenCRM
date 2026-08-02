'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Edit2,
  Eye,
  Trash2,
  Calendar,
  Clock,
  User,
  Store,
} from 'lucide-react';
import { Call } from '@/types';
import { cn } from '@/lib/utils/cn';
import { formatPhone, formatDate, formatTime, getFollowUpStatus, truncate } from '@/lib/utils/formatters';
import { TEL_BASE, WHATSAPP_BASE } from '@/lib/utils/constants';
import StatusBadge, { WebsiteBadge } from '@/components/calls/StatusBadge';
import Dialog from '@/components/ui/Dialog';

interface CallCardProps {
  call: Call;
  onDelete?: (id: string) => Promise<boolean>;
  index?: number;
}

export default function CallCard({ call, onDelete, index = 0 }: CallCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const followUpStatus = getFollowUpStatus(call.followUpDate);

  const followUpBorderColor = {
    overdue: 'border-l-red-500',
    today: 'border-l-orange-400',
    tomorrow: 'border-l-blue-400',
    upcoming: 'border-l-emerald-400',
    none: 'border-l-zinc-200 dark:border-l-zinc-700',
  }[followUpStatus];

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    const success = await onDelete(call._id);
    setIsDeleting(false);
    if (success) setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        className={cn(
          'bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800',
          'shadow-soft dark:shadow-dark-soft',
          'border-l-4',
          followUpBorderColor,
          'overflow-hidden'
        )}
      >
        {/* Card Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                  <Store className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight truncate">
                  {call.shopName}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 mt-1 ml-9">
                <Phone className="w-3 h-3 text-zinc-400" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                  {formatPhone(call.shopNumber)}
                </span>
              </div>
            </div>
            <StatusBadge status={call.callStatus} size="sm" />
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <WebsiteBadge discussed={call.websiteDiscussed} size="sm" />
            {call.followUpDate && (
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                followUpStatus === 'overdue' && 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-transparent',
                followUpStatus === 'today' && 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-transparent',
                followUpStatus === 'tomorrow' && 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-transparent',
                followUpStatus === 'upcoming' && 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-transparent',
              )}>
                <Calendar className="w-3 h-3" />
                {formatDate(call.followUpDate)}
                {call.followUpTime && (
                  <><Clock className="w-3 h-3 ml-0.5" />{formatTime(call.followUpTime)}</>
                )}
              </span>
            )}
          </div>

          {/* Remarks */}
          {call.remarks && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed line-clamp-2">
              {truncate(call.remarks, 100)}
            </p>
          )}

          {/* Added by + date */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-zinc-400" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{call.addedBy}</span>
            </div>
            <span className="text-zinc-200 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{formatDate(call.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex border-t border-zinc-100 dark:border-zinc-800 divide-x divide-zinc-100 dark:divide-zinc-800">
          <a
            href={`${TEL_BASE}${call.shopNumber}`}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors active:bg-emerald-100"
          >
            <Phone className="w-4 h-4" />
            <span className="text-[10px] font-medium">Call</span>
          </a>
          <a
            href={`${WHATSAPP_BASE}${call.shopNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[#25D366] hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors active:bg-green-100"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] font-medium">WhatsApp</span>
          </a>
          <Link
            href={`/calls/${call._id}`}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors active:bg-blue-100"
          >
            <Eye className="w-4 h-4" />
            <span className="text-[10px] font-medium">View</span>
          </Link>
          <Link
            href={`/calls/${call._id}?edit=true`}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors active:bg-zinc-100"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-[10px] font-medium">Edit</span>
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors active:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[10px] font-medium">Delete</span>
          </button>
        </div>
      </motion.div>

      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Record?"
        description={`This will permanently delete "${call.shopName}". This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
