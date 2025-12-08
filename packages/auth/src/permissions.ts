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

    can(['create', 'get'], 'Project', {
      requestingDepartamentId: { $eq: user.departamentId },
    })

    can(['update', 'delete'], 'Project', {
      requestingDepartamentId: { $eq: user.departamentId },
      status: { $in: ['IN_PROGRESS', 'STOPPED', 'WAITING'] },
    })
  },
  BILLING(_, { can }) {
    can('manage', 'Billing')
  },
}

/*
criar/atualizar models
criar/atualizar perfis de permissoes
criar/atualizar permissoes por perfil

criar rotas de api para novos contextos
atualizar rotas de api para contextos atualizados

refatorar regras de negocio nas telas existentes
criasr telas e funcionalidades novas
*/
