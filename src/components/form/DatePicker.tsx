import { FormControl, FormHelperText, Typography } from '@mui/material'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import styles from './Form.module.css'

dayjs.extend(utc)

interface Props<T extends FieldValues> {
  name: FieldPath<T>
  label?: string
  control: Control<T>
  ['data-testid']?: string
  clearable?: boolean
  fullWidth?: boolean
}

export const FormDatePicker = <T extends FieldValues>({
  name,
  label,
  control,
  'data-testid': dataTestId,
  clearable = false,
  fullWidth = false,
  ...datePickerProps
}: Props<T> & DatePickerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth={fullWidth}>
          {label ? (
            <Typography sx={{ fontWeight: 'bold' }} className="mb-2">
              {label}
            </Typography>
          ) : null}
          <DatePicker
            {...datePickerProps}
            slotProps={{
              textField: {
                error: !!error,
                // data-testid is forwarded to the DOM but is not part of the picker text-field slot type.
                // @ts-expect-error data-testid is not declared on PickersTextField slot props
                'data-testid': dataTestId,
                className: styles.datePickerInput,
              },
              field: { clearable },
            }}
            sx={{ backgroundColor: 'white', flex: '1' }}
            onChange={(date) => {
              if (date && date.isValid()) {
                onChange(date.utc(true).format())
              } else if (date == null && clearable) {
                onChange(null)
              }
            }}
            value={value ? dayjs(value) : null}
          />
          {error?.message && <FormHelperText className={styles.helper}>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}
