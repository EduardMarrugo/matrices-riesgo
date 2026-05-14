import { z } from 'zod'

const rowControlsSchema = z.object({
  engineering: z.string(),
  administrative: z.string(),
  ppe: z.string(),
})

export const matrixRowSchema = z.object({
  id: z.string(),
  activity: z.string().min(1),
  hazard: z.string().min(1),
  controls: rowControlsSchema,
  probability: z.number().positive(),
  consequence: z.number().positive(),
})

export const matrixFormSchema = z.object({
  rows: z.array(matrixRowSchema),
})

export type MatrixRowFormValues = z.infer<typeof matrixRowSchema>
export type MatrixFormValues = z.infer<typeof matrixFormSchema>
