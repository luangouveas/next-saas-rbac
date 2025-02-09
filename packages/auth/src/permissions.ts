import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_user, { can }) {
    can('manage', 'all')
  },
  MEMBER(_user, { can }) {
    // can('invite', 'User')
    can('create', 'Project')
  },
  BILLING() {},
}
