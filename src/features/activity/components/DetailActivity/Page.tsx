import { motion } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import Alert from '@components/Alert'
import Button from '@components/Button'
import Error from '@components/Error'
import Icon from '@components/Icon'

import useDisclosure from '@hooks/useDisclosure'

import { useActivityDetail, useTodoList } from '@features/activity/services'

import { TodoItemDTO } from '@dto/activity'

import { getResultError, isNotFound } from '@utils/base'

import Card from './Card'
import Empty from './Empty'
import SortTodo from './SortTodo'
import TodoModal from './TodoModal'
import { SortAction } from './types'

const Page: React.FC = () => {
  const { id } = useParams()
  const modal = useDisclosure()
  const activityDetail = useActivityDetail(id as string)
  const todoList = useTodoList({
    activity_group_id: id as string,
  })

  const [sort, setSort] = useState<SortAction>()
  const isEmpty = activityDetail.data?.todo_items.length === 0
  const todoDatas = useMemo(() => {
    if (isEmpty) return []
    const todos = todoList.data?.data || ([] as TodoItemDTO[])
    if (!sort) return todos
    return todos.sort((a, b) => sort.action(a, b))
  }, [todoList.data, sort])

  if (!id || isNotFound(activityDetail)) {
    return (
      <Error code='404' title='Activity Tidak Ditemukan' className='-mt-36'>
        <div className='mt-2'>
          Activity yang Anda cari tidak ada atau terjadi kesalahan lain. Kembali
          ke{' '}
          <Link to='/' className='text-gray-700 underline'>
            halaman utama
          </Link>
          .
        </div>
      </Error>
    )
  }

  const isLoading = activityDetail.isLoading || todoList.isLoading

  const handleCreateTodo = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    modal.open()
  }

  const handleOnSort = (sortAction: SortAction) => {
    setSort(sortAction)
  }

  return (
    <div className='container'>
      <TodoModal activityGroupId={id} modal={modal} />
      <div className='flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-3'>
        <div className='flex w-full flex-col items-center gap-3 text-gray-800 lg:flex-row'>
          <Link to='/' className='mr-auto flex items-center gap-1 lg:mx-auto'>
            <Icon type='back' className='h-5 w-5 lg:h-8 lg:w-8' />
            <span className='block lg:hidden'>Back</span>
          </Link>
          <div className='flex w-full items-center gap-3'>
            {activityDetail.isLoading ? (
              <div className='flex w-full max-w-3xl flex-col gap-2.5'>
                <div className='h-6 w-full animate-pulse rounded-md bg-gray-200' />
                <div className='h-6 w-full animate-pulse rounded-md bg-gray-200' />
                <div className='h-6 w-1/2 animate-pulse rounded-md bg-gray-200' />
              </div>
            ) : activityDetail.error ? (
              <Alert
                variant='danger'
                message={getResultError(activityDetail.error)}
              />
            ) : (
              <h2 className='line-clamp-6 max-w-3xl text-2xl font-semibold sm:line-clamp-5 md:line-clamp-4 lg:line-clamp-3'>
                {activityDetail.data?.title}
              </h2>
            )}
            <Button
              type='button'
              variant='ghost'
              isIcon
              isRounded
              disabled={activityDetail.isLoading}
            >
              <Icon type='pencil' className='h-5 w-5 text-gray-600' />
            </Button>
          </div>
        </div>
        <div className='ml-auto flex items-center gap-4 lg:mx-auto'>
          <SortTodo isLoading={isLoading} sort={sort} onSort={handleOnSort} />
          <Button
            type='button'
            leftIcon={<Icon type='plus' className='mr-2 h-5 w-5' />}
            variant='solid'
            color='primary'
            size='lg'
            disabled={isLoading}
            onClick={handleCreateTodo}
            isRounded
          >
            Tambah
          </Button>
        </div>
      </div>
      <div className='mt-10 pb-6 md:mt-14 md:pb-14'>
        {todoList.isLoading ? (
          <div>Loading....</div>
        ) : todoList.isError ? (
          <Alert variant='danger' message={getResultError(todoList.error)} />
        ) : isEmpty ? (
          <Empty className='mx-auto h-auto w-full max-w-xl' />
        ) : (
          <div className='flex flex-col gap-4'>
            {todoDatas.map((todo) => {
              return (
                <motion.div
                  key={todo.id}
                  layout
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 120,
                  }}
                >
                  <Card todo={todo} activityGroupId={id} />
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
