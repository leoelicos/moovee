/* components */
import { Tag, Button, Modal, Collapse } from 'antd'

import { useState } from 'react'
import useYouTube from '../../hooks/useYouTube'
import Trailer from './Trailer.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faStar } from '@fortawesome/free-solid-svg-icons'

function NoPoster({ title }) {
  return (
    <div className='noposter'>
      <div className='title'>{title}</div>
      <div className='text'>No poster</div>
    </div>
  )
}
const { Panel } = Collapse

const Result = ({
  poster,
  title,
  esrb,
  year,
  genre,
  actors,
  plot,
  imdbRating,
  idx,
  idxOfClickedTrailer, //
  setIdxOfClickedTrailer,
  resetIdxOfClickedTrailer,
  trailerWasClicked,
  setTrailerWasClicked
}) => {
  const { youTubeData, youTubeLoading, youTubeError, searchYouTube } = useYouTube()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideModal = () => {
    setIsModalOpen(false)
  }
  const handleClickTrailer = async () => {
    try {
      setTrailerWasClicked(true)
      setIdxOfClickedTrailer(idx)
      const query = [title || '', year || '', 'trailer'].join('+')
      await searchYouTube(query)
      setTrailerWasClicked(false)
      resetIdxOfClickedTrailer()

      setIsModalOpen(true)
    } catch (error) {
      console.error(error)
      setIsModalOpen(false)
    }
  }

  return (
    <div className='result-container'>
      {poster ? (
        <div className='movie-poster'>
          <img
            src={poster}
            alt='movie poster'
          />
        </div>
      ) : (
        <div className='movie-poster'>
          <NoPoster title={title} />
        </div>
      )}

      <div className='result'>
        <Button
          block
          loading={youTubeLoading}
          disabled={youTubeError || (trailerWasClicked && idxOfClickedTrailer !== idx)}
          className='trailer-btn'
          type='primary'
          onClick={handleClickTrailer}>
          <FontAwesomeIcon icon={faFilm} />
        </Button>
        <Collapse
          expandIconPosition='start'
          bordered={false}
          className='details'>
          <Panel
            className='panel'
            key='1'
            header={
              <span
                className={
                  imdbRating <= 2
                    ? 'one' //
                    : imdbRating <= 4
                    ? 'two'
                    : imdbRating <= 6
                    ? 'three'
                    : imdbRating <= 8
                    ? 'four'
                    : 'five'
                }>
                {!imdbRating ? (
                  '' //
                ) : imdbRating <= 2 ? (
                  <FontAwesomeIcon icon={faStar} />
                ) : imdbRating <= 4 ? (
                  <>
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </>
                ) : imdbRating <= 6 ? (
                  <>
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </>
                ) : imdbRating <= 8 ? (
                  <>
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </>
                )}
              </span>
            }>
            {
              <>
                <div className='deets'>
                  <h3 className='title'>{title || 'Untitled'}</h3>

                  {year && <div className='year'>{year}</div>}

                  {esrb && <div className='esrb'>{esrb}</div>}

                  {plot && <div className='plot'>{plot}</div>}

                  {actors.length > 0 && (
                    <div className='actors'>
                      {actors.split(', ').map((actor, i) => (
                        <Tag
                          key={i}
                          color='#222'
                          style={{ color: 'white' }}>
                          {actor}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {genre && (
                    <div className='genre'>
                      {genre.map((g, i) => (
                        <Tag
                          color='black'
                          key={i}>
                          {g}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </>
            }
          </Panel>
        </Collapse>
      </div>

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
        <Trailer uri={youTubeData} />
      </Modal>
    </div>
  )
}
export default Result
