import { Prisma } from '@/db-common'

export const OrganizationVersionWithOrganizationSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  organizationId: true,
  isCR: true,
  onboarded: true,
  onboarderId: true,
  parentId: true,
  parent: {
    select: {
      id: true,
    },
  },
  organization: {
    select: {
      oldBCId: true,
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      importedFileDate: true,
      wordpressId: true,
      sites: {
        select: {
          name: true,
          etp: true,
          ca: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          organizationId: true,
          oldBCId: true,
          postalCode: true,
          city: true,
          address: true,
          cncId: true,
          cnc: {
            select: {
              cncCode: true,
              seances: true,
              entrees2024: true,
              entrees2023: true,
              semainesActivite: true,
              latitude: true,
              longitude: true,
              cncVersionId: true,
            },
          },
        },
        orderBy: { createdAt: Prisma.SortOrder.asc },
      },
    },
  },
  userAccounts: {
    select: {
      user: {
        select: {
          level: true,
        },
      },
    },
  },
}
