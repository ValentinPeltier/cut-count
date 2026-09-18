
import { useMemo } from 'react'

export const Logo = () => {
  const logo = useMemo(() => ({ src: '/logos/cut/logo.svg', alt: 'Logo de COUNT', width: 98, height: 48 }), [])

  return (
    <div className="h100 align-center gapped1">
      <img data-testid="logo-cut" src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
    </div>
  )
}
