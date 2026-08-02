'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Edit2,
  Trash2,
  Calendar,
  Globe,
  Store,
  FileText,
} from 'lucide-react';
import { useCall } from '@/hooks/useCalls';
import { useUser } from '@/hooks/useUser';
import StatusBadge, { WebsiteBadge } from '@/components/calls/StatusBadge';
import CallForm from '@/components/calls/CallForm';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatTime, formatCreatedAt, formatPhone } from '@/lib/utils/formatters';
import { TEL_BASE, WHATSAPP_BASE } from '@/lib/utils/constants';
import toast from 'react-hot-toast';

interface Props {
  params: { id: string };
}

export default function CallDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const { user, isLoaded } = useUser();
  const { call, isLoading, error, refetch } = useCall(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/login');
    }
  }, [isLoaded, user, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/calls/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Record deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete record');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (!isLoaded || !user) return null;

  if (isLoading) {
    return (
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !call) {
    return (
      <div className="px-4 py-4 md:px-6 max-w-2xl mx-auto text-center py-20">
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">Record not found</p>
        <Link href="/" className="text-primary-600 hover:underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="min-h-screen md:min-h-0">
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 md:px-6 md:pt-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Edit Record</h1>
        </div>
        <div className="md:max-w-2xl md:mx-auto md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:bg-white md:dark:bg-zinc-900 md:rounded-2xl md:border md:border-zinc-100 md:dark:border-zinc-800 md:shadow-soft"
          >
            <CallForm
              initialData={call}
              user={user}
              onSuccess={() => {
                refetch();
                router.replace(`/calls/${id}`);
              }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-2xl mx-auto pb-32 md:pb-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {call.shopName}
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 font-mono">
              {formatPhone(call.shopNumber)}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-soft overflow-hidden mb-4"
        >
          {/* Status Header */}
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <StatusBadge status={call.callStatus} size="lg" />
            <WebsiteBadge discussed={call.websiteDiscussed} size="md" />
          </div>

          {/* Details */}
          <div className="p-5 space-y-4">
            {/* Shop Info */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Store className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Shop</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{call.shopName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Phone</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 font-mono">
                  +91 {formatPhone(call.shopNumber)}
                </p>
              </div>
            </div>

            {call.followUpDate && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Follow Up</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatDate(call.followUpDate)}
                    {call.followUpTime && (
                      <span className="text-zinc-500 dark:text-zinc-400 ml-2">
                        at {formatTime(call.followUpTime)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Website Discussed</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{call.websiteDiscussed}</p>
              </div>
            </div>

            {call.remarks && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Remarks</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {call.remarks}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Added By</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {call.addedBy[0]}
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{call.addedBy}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Created</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(call.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Last Updated</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(call.updatedAt)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex gap-3">
          <a
            href={`${TEL_BASE}${call.shopNumber}`}
            className="flex-1"
          >
            <Button variant="success" fullWidth size="lg" leftIcon={<Phone className="w-4 h-4" />}>
              Call Shop
            </Button>
          </a>
          <a
            href={`${WHATSAPP_BASE}${call.shopNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              leftIcon={<MessageCircle className="w-4 h-4" />}
              className="bg-[#25D366] hover:bg-[#1ebe5d] text-white"
            >
              WhatsApp
            </Button>
          </a>
          <Link href={`/calls/${id}?edit=true`} className="flex-1">
            <Button variant="outline" fullWidth size="lg" leftIcon={<Edit2 className="w-4 h-4" />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="lg"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Actions */}
      <div className="fixed bottom-16 md:hidden left-0 right-0 z-30 px-4 pb-3 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-zinc-50/95 dark:via-zinc-950/95 to-transparent pt-6">
        <div className="flex gap-3">
          <a href={`${TEL_BASE}${call.shopNumber}`} className="flex-1">
            <Button variant="success" fullWidth size="lg" leftIcon={<Phone className="w-4 h-4" />}>
              Call
            </Button>
          </a>
          <a
            href={`${WHATSAPP_BASE}${call.shopNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              fullWidth
              size="lg"
              leftIcon={<MessageCircle className="w-4 h-4" />}
              className="bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg"
            >
              WhatsApp
            </Button>
          </a>
          <Link href={`/calls/${id}?edit=true`}>
            <Button variant="secondary" size="lg" leftIcon={<Edit2 className="w-4 h-4" />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="lg"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

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
