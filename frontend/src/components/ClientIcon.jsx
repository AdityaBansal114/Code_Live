import React from 'react'

const ClientIcon = ({username}) => {
  return (
    <div className='w-full'>
        <div className='text-gray-400  text-sm text-left ml-9'>{username}</div>
        <div className='divider m-1 '></div>
    </div>
  )
}

export default ClientIcon