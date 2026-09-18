import { Translations } from '@/lib'
import { customRich } from '@/lib/utils/customRich'

export const handleWarningText = (t: Translations, text: string) => {
  return <span>{customRich(t, text, { warning: (children) => <span className="userWarning">{children}</span> })}</span>
}
