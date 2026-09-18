
import { auth } from '@/services/auth'
import {
  getMethodologyDocumentFileName,
  isMethodologyDocumentKey,
  resolveMethodologyDocumentPath,
} from '@/services/ressources/methodologyDocuments'
import { readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const documentKey = req.nextUrl.searchParams.get('documentKey')
  if (!documentKey || !isMethodologyDocumentKey(documentKey)) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  const filePath = resolveMethodologyDocumentPath(documentKey)
  const fileName = getMethodologyDocumentFileName(documentKey)

  try {
    const buffer = await readFile(filePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
