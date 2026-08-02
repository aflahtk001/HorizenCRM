import { z } from 'zod';

const phoneRegex = /^[6-9]\d{9}$/;

export const callSchema = z.object({
  shopName: z
    .string()
    .min(1, 'Shop name is required')
    .max(100, 'Shop name must be less than 100 characters')
    .trim(),

  shopNumber: z
    .string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits')
    .regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number')
    .trim(),

  callStatus: z.enum(
    ['Answered', 'Rejected', 'Busy', 'No Answer', 'Switched Off', 'Call Back Later'],
    { errorMap: () => ({ message: 'Please select a call status' }) }
  ),

  websiteDiscussed: z.enum(['Yes', 'No'], {
    errorMap: () => ({ message: 'Please select if website was discussed' }),
  }),

  followUpDate: z.string().optional(),

  followUpTime: z.string().optional(),

  remarks: z.string().max(1000, 'Remarks must be less than 1000 characters').optional(),

  addedBy: z.string().min(1, 'Added by is required'),
});

export type CallFormValues = z.infer<typeof callSchema>;

export const updateCallSchema = callSchema.partial().extend({
  addedBy: z.string().min(1, 'Added by is required'),
});

export type UpdateCallValues = z.infer<typeof updateCallSchema>;
