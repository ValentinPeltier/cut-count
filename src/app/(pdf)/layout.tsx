import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/** PDF routes share the root Emotion/theme providers; no dashboard chrome. */
const PdfLayout = ({ children }: Props) => children

export default PdfLayout
