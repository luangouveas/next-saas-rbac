import { defineAbilityFor, Role, userSchema } from '@saas/auth'

export type UserPermissions = {
  id: string
  userId: string
  role: Role
  organizationId: string
  organizationOwnerId: string
  unitId: string
  departamentId: string
}

export function getUserPermissions(userPermissions: UserPermissions) {
  const authUser = userSchema.parse({
    id: userPermissions.userId,
    role: userPermissions.role,
    organizationId: userPermissions.organizationId,
    organizationOwnerId: userPermissions.organizationOwnerId,
    unitId: userPermissions.unitId,
    departamentId: userPermissions.departamentId,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
