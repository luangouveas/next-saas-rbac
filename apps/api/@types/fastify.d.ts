import 'fastify'

import { UserPermissions } from '@/utils/get-user-permissions'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(slug: string): Promise<UserPermissions>
  }
}
