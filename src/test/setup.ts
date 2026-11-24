import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { clearOmdbCache } from '../api/omdb'
import { clearTmdbCache } from '../api/tmdb'
import { keys } from '../lib/env'

// jsdom has no <dialog> modal support yet.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

beforeEach(() => {
  Object.assign(keys, { omdb: 'test-omdb', tmdb: 'test-tmdb', youtube: 'test-youtube' })
  localStorage.clear()
  clearOmdbCache()
  clearTmdbCache()
  delete document.documentElement.dataset.theme
})

afterEach(() => {
  cleanup()
})
