import { Button, Modal } from 'antd'
import { useContext } from 'react'
import { MovieContext, MovieDispatchContext } from '../../context'

export default function ModalTrailer({ children }) {
  const { isModalOpen } = useContext(MovieContext)
  const dispatch = useContext(MovieDispatchContext)

  const hideModal = () => {
    dispatch({ type: 'modalClose' })
  }

  return (
    <Modal
      open={isModalOpen}
      onOk={hideModal}
      onCancel={hideModal}
      closable={false}
      maskClosable={true}
      className='moovee-modal'
      footer={
        <Button
          type='primary'
          block
          key='close'
          onClick={hideModal}>
          Close
        </Button>
      }
      maskStyle={{ background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%)' }}
      transitionName='' // cancel popup animation
    >
      {children}
    </Modal>
  )
}
