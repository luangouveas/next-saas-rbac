import { z } from 'zod'

import { departamentSchema } from '../models/departament'

export const departamentSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Departament'), departamentSchema]),
])

export type DepartamentSubject = z.infer<typeof departamentSubject>
