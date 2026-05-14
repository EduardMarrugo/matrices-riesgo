import { z } from 'zod'

const sharedControlsSchema = z.object({
  engineering: z.string(),
  administrative: z.string(),
  ppe: z.string(),
})

const sstEvaluationSchema = z.object({
  hazardType: z.string().min(1),
  hazardDescription: z.string().min(1),
  effects: z.string(),
  probability: z.number().positive(),
  consequence: z.number().positive(),
  isPriority: z.boolean(),
})

const masoEvaluationSchema = z.object({
  aspect: z.string(),
  impact: z.string(),
  probability: z.number().positive(),
  consequence: z.number().positive(),
  isSignificant: z.boolean(),
})

export const activityFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  responsibleRole: z.string(),
  sst: sstEvaluationSchema,
  maso: masoEvaluationSchema,
  controls: sharedControlsSchema,
})

export type ActivityFormValues = z.infer<typeof activityFormSchema>
