import { useParams } from 'react-router-dom'
import { useDialog } from '@/components/Dialog/DialogProvider'
import {
  useGetFeedbackByIdQuery,
  useToggleFeedbackReadMutation,
} from '@/redux/apis/Feedback'

const useFeedbackDetailController = () => {
  const { id } = useParams()
  const { acknowledge } = useDialog()

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetFeedbackByIdQuery(id, { skip: !id })

  const [toggleFeedbackRead, { isLoading: is_toggling }] =
    useToggleFeedbackReadMutation()

  const feedback = data?.data || null

  const onToggleRead = async () => {
    if (!feedback) return

    const next_read = !feedback.is_read

    try {
      await toggleFeedbackRead(feedback._id).unwrap()

      await acknowledge({
        title: next_read ? 'Marked as read' : 'Marked as unread',
        description: next_read
          ? 'This feedback has been marked as read.'
          : 'This feedback has been marked as unread.',
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      await acknowledge({
        title: 'Unable to update status',
        description:
          err?.data?.message ||
          err?.error ||
          'Unable to update feedback status.',
        confirmLabel: 'Got it',
        variant: 'danger',
      })
    }
  }

  return {
    values: {
      feedback,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load feedback.',
      is_toggling,
    },
    functions: {
      onToggleRead,
      refetch,
    },
  }
}

export default useFeedbackDetailController
