'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { callSchema, CallFormValues } from '@/lib/validations/call';
import { CALL_STATUS_OPTIONS, WEBSITE_DISCUSSED_OPTIONS } from '@/lib/utils/constants';
import Input, { Textarea } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Call } from '@/types';
import { Save, Store, Phone, Clock, Calendar } from 'lucide-react';

interface CallFormProps {
  initialData?: Call;
  onSuccess?: () => void;
  user: string;
}

export default function CallForm({ initialData, onSuccess, user }: CallFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CallFormValues>({
    resolver: zodResolver(callSchema),
    defaultValues: initialData
      ? {
          shopName: initialData.shopName,
          shopNumber: initialData.shopNumber,
          callStatus: initialData.callStatus,
          websiteDiscussed: initialData.websiteDiscussed,
          followUpDate: initialData.followUpDate || '',
          followUpTime: initialData.followUpTime || '',
          remarks: initialData.remarks || '',
          addedBy: initialData.addedBy,
        }
      : {
          callStatus: 'Answered',
          websiteDiscussed: 'No',
          addedBy: user,
        },
  });

  const onSubmit = async (data: CallFormValues) => {
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/calls/${initialData._id}` : '/api/calls';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, addedBy: user }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Something went wrong');
      }

      toast.success(isEditing ? 'Record updated successfully!' : 'Call record added!', {
        icon: '✅',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 space-y-4 pb-24 md:pb-6"
    >
      <motion.div variants={itemVariants}>
        <Input
          id="shopName"
          label="Shop Name"
          placeholder="e.g. Sharma Electronics"
          required
          autoFocus
          leftIcon={<Store className="w-4 h-4" />}
          error={errors.shopName?.message}
          {...register('shopName')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          id="shopNumber"
          label="Phone Number"
          placeholder="10-digit mobile number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          required
          leftIcon={<Phone className="w-4 h-4" />}
          hint="+91 prefix will be added automatically"
          error={errors.shopNumber?.message}
          {...register('shopNumber')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Select
          id="callStatus"
          label="Call Status"
          required
          options={CALL_STATUS_OPTIONS}
          placeholder="Select status..."
          error={errors.callStatus?.message}
          {...register('callStatus')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Select
          id="websiteDiscussed"
          label="Website Details Discussed"
          required
          options={WEBSITE_DISCUSSED_OPTIONS}
          error={errors.websiteDiscussed?.message}
          {...register('websiteDiscussed')}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <Input
          id="followUpDate"
          label="Follow Up Date"
          type="date"
          leftIcon={<Calendar className="w-4 h-4" />}
          error={errors.followUpDate?.message}
          {...register('followUpDate')}
        />
        <Input
          id="followUpTime"
          label="Follow Up Time"
          type="time"
          leftIcon={<Clock className="w-4 h-4" />}
          error={errors.followUpTime?.message}
          {...register('followUpTime')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Textarea
          id="remarks"
          label="Remarks"
          placeholder="Notes about this call, what was discussed, next steps..."
          rows={4}
          error={errors.remarks?.message}
          {...register('remarks')}
        />
      </motion.div>

      {/* Added By (read-only display) */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
            {user?.[0]}
          </div>
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Added By</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user}</p>
          </div>
        </div>
      </motion.div>

      {/* Hidden addedBy input */}
      <input type="hidden" {...register('addedBy')} value={user} />

      <motion.div variants={itemVariants} className="pt-2">
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Record' : 'Save Call Record'}
        </Button>
      </motion.div>
    </motion.form>
  );
}
