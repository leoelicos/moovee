import { addRecent, clearRecent, getRecent, MAX_RECENT, removeRecent } from './history'

describe('recent searches', () => {
  it('adds newest first without duplicates, capped', () => {
    for (let i = 0; i < MAX_RECENT + 2; i++) addRecent(`q${i}`)
    addRecent('Q9')
    const recent = getRecent()
    expect(recent).toHaveLength(MAX_RECENT)
    expect(recent[0]).toBe('Q9')
    expect(recent.filter((q) => q.toLowerCase() === 'q9')).toHaveLength(1)
  })

  it('ignores blank queries', () => {
    expect(addRecent('   ')).toEqual([])
  })

  it('removes and clears', () => {
    addRecent('a')
    addRecent('b')
    expect(removeRecent('a')).toEqual(['b'])
    expect(clearRecent()).toEqual([])
  })

  it('migrates the CRA "movies" key', () => {
    localStorage.setItem('movies', JSON.stringify(['Up', 3, 'Heat']))
    expect(getRecent()).toEqual(['Up', 'Heat'])
    expect(localStorage.getItem('moovee:recent')).toBe('["Up","Heat"]')
  })

  it('survives corrupt data and blocked storage', () => {
    localStorage.setItem('moovee:recent', '{bad')
    expect(getRecent()).toEqual([])
    localStorage.setItem('moovee:recent', '{"a":1}')
    expect(getRecent()).toEqual([])
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(addRecent('x')).toEqual(['x'])
  })
})
