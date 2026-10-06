import { useRef } from 'react'
import './AvatarUpload.scss'

const AvatarUpload = ({ preview, name, onChange, error }) => {
  const input_ref = useRef(null)

  const initials = (name || 'A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const onFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onChange?.(file)
  }

  return (
    <div className={`avatar-upload ${error ? 'avatar-upload--error' : ''}`}>
      <button
        type="button"
        className="avatar-upload__preview"
        onClick={() => input_ref.current?.click()}
        aria-label="Change profile photo"
      >
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <span className="avatar-upload__initials">{initials || 'A'}</span>
        )}
        <span className="avatar-upload__badge">+</span>
      </button>

      <input
        ref={input_ref}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="avatar-upload__input"
        onChange={onFileChange}
      />

      <p className="avatar-upload__hint">Click to upload a profile photo</p>
      {error ? <p className="avatar-upload__error">{error}</p> : null}
    </div>
  )
}

export default AvatarUpload
