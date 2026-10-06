import { useRef } from 'react'
import './ImageField.scss'

const ImageField = ({
  label = 'Image',
  required = false,
  preview,
  onChange,
  error,
  hint = 'PNG or JPG, recommended square image',
}) => {
  const input_ref = useRef(null)

  return (
    <div className={`image-field ${error ? 'image-field--error' : ''}`}>
      {label ? (
        <label className="image-field__label">
          {label}
          {required ? <span className="image-field__required">*</span> : null}
        </label>
      ) : null}

      <div className="image-field__body">
        <button
          type="button"
          className="image-field__preview"
          onClick={() => input_ref.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="" />
          ) : (
            <span className="image-field__placeholder">Upload</span>
          )}
        </button>

        <div className="image-field__meta">
          <button
            type="button"
            className="image-field__browse"
            onClick={() => input_ref.current?.click()}
          >
            Choose Image
          </button>
          <p className="image-field__hint">{hint}</p>
          {error ? <p className="image-field__error">{error}</p> : null}
        </div>
      </div>

      <input
        ref={input_ref}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="image-field__input"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onChange?.(file)
        }}
      />
    </div>
  )
}

export default ImageField
