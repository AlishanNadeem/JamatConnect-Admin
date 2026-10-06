export const convertToFormData = (data = {}) => {
  const form_data = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (value instanceof File || value instanceof Blob) {
      form_data.append(key, value)
      return
    }

    form_data.append(key, String(value))
  })

  return form_data
}

export const formatPhone = (user) => {
  if (!user?.phone) return '—'
  const dialing = user?.dialing_code ? `${user.dialing_code} ` : ''
  return `${dialing}${user.phone}`
}

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
