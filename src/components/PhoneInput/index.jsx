import { forwardRef } from 'react'
import { DIALING_CODES } from '@/helpers/data'
import './PhoneInput.scss'

const PhoneInput = forwardRef(
  (
    {
      label = 'Phone Number',
      required = false,
      error,
      countryCode,
      dialingCode,
      onCountryChange,
      ...rest
    },
    ref
  ) => {
    const selected_value = `${countryCode || ''}|${dialingCode || ''}`

    return (
      <div className={`phone-input ${error ? 'phone-input--error' : ''}`}>
        {label ? (
          <label className="phone-input__label">
            {label}
            {required ? <span className="phone-input__required">*</span> : null}
          </label>
        ) : null}

        <div className="phone-input__row">
          <select
            className="phone-input__country"
            value={selected_value}
            onChange={(event) => {
              const [code, calling_code] = event.target.value.split('|')
              onCountryChange?.({ code, calling_code })
            }}
          >
            {DIALING_CODES.map((item) => (
              <option
                key={`${item.code}-${item.calling_code}`}
                value={`${item.code}|${item.calling_code}`}
              >
                {item.calling_code} ({item.code})
              </option>
            ))}
          </select>

          <input
            ref={ref}
            type="tel"
            className="phone-input__control"
            placeholder="Enter phone number"
            {...rest}
          />
        </div>

        {error ? <p className="phone-input__error">{error}</p> : null}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput
