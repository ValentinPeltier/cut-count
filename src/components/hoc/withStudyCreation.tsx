import React from 'react'
import { UserSessionProps } from './withAuth'

export type StudyCreationProps = {
  isCut: boolean
}

interface Props {
  searchParams: Promise<{ duplicate?: string }>
}

const withStudyCreation = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WrappedComponent: React.ComponentType<any & UserSessionProps & StudyCreationProps>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = async (props: any & Props & UserSessionProps) => {
    const searchParams = await props.searchParams
    const isCut = searchParams.simplified === 'true'

    return <WrappedComponent {...props} isCut={isCut} />
  }

  Component.displayName = 'WithStudyCreation'
  return Component
}

export default withStudyCreation
