'use server'

import { getMethodologyDownloadApiPath, isMethodologyDocumentKey } from '@/services/ressources/methodologyDocuments'
import { withServerResponse } from '@/utils/serverResponse'
import { dbActualizedAuth } from '../auth'

export const getDocumentUrl = async (documentKey: string) =>
  withServerResponse('getDocumentUrl', async () => {
    const session = await dbActualizedAuth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    if (!isMethodologyDocumentKey(documentKey)) {
      throw new Error('Document key not found')
    }

    return getMethodologyDownloadApiPath(documentKey)
  })
