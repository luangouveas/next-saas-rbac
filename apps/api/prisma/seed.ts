import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: 'https://github.com/luangouveas.png',
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const org = await prisma.organization.create({
    data: {
      name: 'Acme Inc',
      slug: 'acme-inc',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      units: {
        createMany: {
          data: [
            {
              name: 'Unit 1 for Acme Inc',
            },
          ],
        },
      },
    },
  })

  const units = await prisma.unit.findMany({
    where: { organizationId: org.id },
  })

  units.forEach(async (unit) => {
    await prisma.departament.createMany({
      data: [
        {
          name: faker.person.jobArea(),
          unitId: unit.id,
        },
        {
          name: faker.person.jobArea(),
          unitId: unit.id,
        },
      ],
    })

    const departaments = await prisma.departament.findMany({
      where: { unitId: unit.id },
    })

    const memberAdmin = await prisma.member.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        unitId: units[0].id,
        departamentId: departaments[0].id,
        role: 'ADMIN',
      },
    })

    const member = await prisma.member.create({
      data: {
        userId: anotherUser.id,
        organizationId: org.id,
        unitId: units[0].id,
        departamentId: departaments[1].id,
        role: 'MEMBER',
      },
    })

    const project = await prisma.project.create({
      data: {
        name: faker.lorem.words({ min: 3, max: 5 }).toUpperCase(),
        description: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        startDate: new Date().toISOString(),
        forecastDate: new Date(
          Date.now() + 20 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'IN_PROGRESS',
        organizationId: org.id,
        managerId: memberAdmin.userId,
        requestingDepartamentId: memberAdmin.departamentId,
        agentId: member.userId,
        agentDepartamentId: member.departamentId,
      },
    })

    await prisma.projectStep.createMany({
      data: [
        {
          startDate: faker.date.recent(),
          forecastDate: faker.date.future(),
          name: faker.lorem.sentence(10),
          status: 'IN_PROGRESS',
          userId: anotherUser.id,
          projectId: project.id,
        },
        {
          startDate: faker.date.future(),
          forecastDate: faker.date.future(),
          name: faker.lorem.sentence(10),
          status: 'WAITING',
          userId: anotherUser.id,
          projectId: project.id,
        },
      ],
    })
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
