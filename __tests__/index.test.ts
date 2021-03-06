import xs from 'xstream'
import { makeStateDriver } from '../src'
import flatStreamMiddleware from '../src/extra/flatStreamMiddleware'

describe('stateDriver', () => {
  interface State {
    clicks: number,
  }

  const initialState: State = { clicks: 0 }
  interface Action { type: 'Inc' }
  const action: Action = { type: 'Inc' }
  const actions = {
    inc: (): Action => ({ type: 'Inc' }),
  }
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'Inc': {
        return {
          ...state,
          clicks: state.clicks + 1,
        }
      }
    }
  }

  it('should apply actions', () => {
    const driver = makeStateDriver(initialState, actions, reducer)
    const actions$ = xs.fromArray([ action, action, action ])
    const state = driver(actions$)

    let clicks = 0
    return new Promise((resolve, reject) => {
      state.$
        .addListener({
          next(state) {
            expect(state.clicks).toEqual(clicks)
            clicks++
            if (clicks === 4) {
              resolve()
            }
          },
          error: reject,
          complete: () => {
            reject(`should resolve before complete. clicks: ${clicks}`)
          },
        })
    })
  })

  it('should apply middleware', () => {
    const driver = makeStateDriver(initialState, actions, reducer, flatStreamMiddleware)
    const actions$ = xs.fromArray([ xs.of(action), xs.of(action), action ])
    const state = driver(actions$)

    let clicks = 0
    return new Promise((resolve, reject) => {
      state.$
        .addListener({
          next(state) {
            expect(state.clicks).toEqual(clicks)
            clicks++
            if (clicks === 3) {
              resolve()
            }
          },
          error: reject,
          complete: () => {
            reject(`should resolve before complete. clicks: ${clicks}`)
          },
        })
    })
  })
})
