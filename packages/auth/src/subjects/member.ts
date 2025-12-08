import { z } from 'zod'

import { memberSchema } from '../models/member'

export const memberSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Member'), memberSchema]),
])

export type MemberSubject = z.infer<typeof memberSubject>
