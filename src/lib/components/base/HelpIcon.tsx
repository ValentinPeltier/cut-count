import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import { SvgIconProps } from '@mui/material'
import classNames from 'classnames'
import { MouseEventHandler } from 'react'
import styles from './HelpIcon.module.css'

interface Props extends SvgIconProps {
  className?: string
  onClick: MouseEventHandler<SVGSVGElement>
  label: string
}

export const HelpIcon = ({ className, onClick, label, ...props }: Props) => (
  <HelpOutlinedIcon
    color="primary"
    className={classNames(styles.helpIcon, className)}
    onClick={onClick}
    aria-label={label}
    titleAccess={label}
    {...props}
  />
)
