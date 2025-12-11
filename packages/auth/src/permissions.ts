import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update', 'delete'], 'Organization')
    can(['transfer_ownership', 'update', 'delete'], 'Organization', {
      ownerId: { $eq: user.id },
    })

    cannot(
      ['manage'],
      ['Departament', 'Unit', 'Member', 'Project', 'ProjectStep'],
    )
    can(
      ['manage'],
      ['Departament', 'Unit', 'Member', 'Project', 'ProjectStep'],
      {
        organizationId: { $eq: user.organizationId },
      },
    )
  },
  MEMBER(user, { can }) {
    can('get', ['Departament', 'Unit', 'Member'], {
      organizationId: { $eq: user.organizationId },
    })

    can('get', 'Organization', {
      id: { $eq: user.organizationId },
    })

    can(['get', 'create'], 'Project', {
      organizationId: { $eq: user.organizationId },
    })

    can(['update', 'delete'], 'Project', {
      status: { $in: ['IN_PROGRESS', 'STOPPED', 'WAITING'] },
    })
  },
  BILLING(_, { can }) {
    can('manage', 'Billing')
    can('get', 'Organization')
  },
}
