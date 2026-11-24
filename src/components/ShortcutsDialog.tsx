import { Dialog } from './Dialog'
import { Icon } from './Icon'

const SHORTCUTS: [string[], string][] = [
  [['/'], 'Focus search'],
  [['↓'], 'From search, jump to results'],
  [['←', '→', '↑', '↓'], 'Move between results'],
  [['Home', 'End'], 'First or last result'],
  [['Enter'], 'Search now, or open a result'],
  [['Esc'], 'Clear search or close a window'],
  [['?'], 'Show these shortcuts']
]

export function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog labelledBy='shortcuts-title' onClose={onClose} className='dialog--small'>
      <div className='dialog__header'>
        <h2 id='shortcuts-title'>Keyboard shortcuts</h2>
        <button type='button' className='icon-button' aria-label='Close' onClick={onClose}>
          <Icon name='close' />
        </button>
      </div>
      <dl className='shortcuts'>
        {SHORTCUTS.map(([keysList, label]) => (
          <div key={label} className='shortcuts__row'>
            <dt>
              {keysList.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  )
}
