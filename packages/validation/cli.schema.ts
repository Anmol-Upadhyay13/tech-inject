import { z } from 'zod';

export const cliAddRequestSchema = z.object({
  component: z.string().regex(/^[a-z0-9-]+$/, 'Invalid component name format'),
  token: z.string().optional(),
  targetDir: z.string().default('./src/components/ui'),
  overwrite: z.boolean().default(false),
});
