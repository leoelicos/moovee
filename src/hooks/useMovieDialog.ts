import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { addRecent } from '../lib/history'
import { parseSearch, toSearchParams } from '../lib/query'
import { notifyRecent } from './useRecent'

interface ModalState {
  modal?: boolean
}

/** The open title lives in `?m=`, so details are linkable and Back closes them. */
export function useMovieDialog() {
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const state = parseSearch(params)

  const open = useCallback(
    (id: string) => {
      if (state.q) {
        addRecent(state.q)
        notifyRecent()
      }
      navigate(
        { pathname: location.pathname, search: `?${toSearchParams({ ...state, m: id })}` },
        {
          state: { modal: true } satisfies ModalState
        }
      )
    },
    // `state` is derived from `params`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, location.pathname, params]
  )

  const close = useCallback(() => {
    if ((location.state as ModalState | null)?.modal) {
      navigate(-1)
      return
    }
    const search = toSearchParams({ ...state, m: null }).toString()
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location, params])

  return { openId: state.m, open, close }
}
