import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { useMemo } from 'react'

interface Props {
  environment?: Environment
}

export const Logo = ({ environment = Environment.CUT }: Props) => {
  const logo = useMemo(() => ({ src: '/logos/cut/logo.svg', alt: 'Logo de COUNT', width: 98, height: 48 }), [])

  return (
    <div className="h100 align-center gapped1">
      <img data-testid={`logo-${environment}`} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
    </div>
  )
}
