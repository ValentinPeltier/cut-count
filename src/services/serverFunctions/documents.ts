'use server'

import { withServerResponse } from '@/utils/serverResponse'
import { getFileUrlFromBucket } from './scaleway'

export const getDocumentUrl = async (documentKey: string) =>
  withServerResponse('getDocumentUrl', async () => {
    const key = process.env[documentKey]

    if (!key) {
      throw new Error('Document key not found')
    }

    const res = await getFileUrlFromBucket(key)
    return res.success ? res.data : ''
  })
