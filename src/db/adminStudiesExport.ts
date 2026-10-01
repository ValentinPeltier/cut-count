import { prismaClient } from '@/db/client.server'

export const findAllStudySitesForAdminExport = () =>
  prismaClient.studySite.findMany({
    orderBy: [{ site: { name: 'asc' } }, { id: 'asc' }],
    select: {
      id: true,
      numberOfSessions: true,
      numberOfTickets: true,
      numberOfOpenDays: true,
      distanceToParis: true,
      situation: {
        select: {
          situation: true,
          listLayoutSituations: true,
        },
      },
      site: {
        select: {
          name: true,
          cnc: {
            select: {
              nom: true,
              dep: true,
              ecrans: true,
              fauteuils: true,
              numberOfProgrammedFilms: true,
            },
          },
        },
      },
      study: {
        select: {
          name: true,
          resultsUnit: true,
          createdBy: {
            select: {
              user: { select: { email: true } },
            },
          },
        },
      },
    },
  })
