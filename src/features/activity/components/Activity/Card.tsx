import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@components/Button'
import Icon from '@components/Icon'

import { useNotification } from '@hooks/useNotification'

import { useDeleteActivity } from '@features/activity/services'

import { ActivityItemDTO } from '@dto/activity'

import { routeReplace } from '@utils/base'
import { parseDate } from '@utils/datetime'

import { ROUTE } from '@/constants'

const Card: React.FC<{
  activity: ActivityItemDTO
}> = ({ activity: { id, title, created_at } }) => {
  const notification = useNotification()
  const deleteActivity = useDeleteActivity()

  const handleDeleteActivity = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    await deleteActivity
      .mutateAsync({
        data: id,
      })
      .then(() => {
        notification.success('Activity berhasil dihapus')
      })
      .catch(() => {
        notification.error('Activity gagal dihapus')
      })
  }

  return (
    <div className='w-[280px] rounded-md bg-white p-5 shadow-md'>
      <div className='h-44'>
        <Link to={routeReplace(ROUTE.detailActivity, id)}>
          <h3 className='line-clamp-6 text-lg font-semibold text-gray-800'>
            {title}
          </h3>
        </Link>
      </div>
      <div className='mt-2 flex items-center justify-between text-gray-600'>
        <div>{parseDate(created_at)}</div>
        <Button
          variant='light'
          type='button'
          isIcon
          onClick={handleDeleteActivity}
          isLoading={deleteActivity.isLoading}
        >
          <Icon type='trash' className='h-5 w-5 text-gray-600' />
        </Button>
      </div>
    </div>
  )
}

export default Card