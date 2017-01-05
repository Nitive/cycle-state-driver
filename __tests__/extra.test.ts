import xs, { Stream } from 'xstream'
import { makeStateDriver } from '../src'
import flatStreamMiddleware from '../src/extra/flatStreamMiddleware'
import mergeMiddlewares from '../src/extra/mergeMiddlewares'
import createPassContextMiddleware from '../src/extra/passContextMiddleware'

describe('stateDriver extras', () => {
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
          },
          error: reject,
          complete: () => {
            expect(clicks).toEqual(4)
            resolve()
          },
        })
    })
  })

  it('should apply flatStreamMiddleware middleware', () => {
    const driver = makeStateDriver(initialState, actions, reducer, flatStreamMiddleware)
    const actions$ = xs.periodic(100).take(2).mapTo(action)
    const state = driver(actions$)

    let clicks = 0
    return new Promise((resolve, reject) => {
      state.$
        .addListener({
          next(state) {
            expect(state.clicks).toEqual(clicks)
            clicks++
          },
          error: reject,
          complete: () => {
            expect(clicks).toEqual(3)
            resolve()
          },
        })
    })
  })

  it('should apply passContextMiddleware middleware', () => {
    interface Context {
      num: number,
    }

    const driver = makeStateDriver(initialState, actions, reducer, createPassContextMiddleware({ num: 42 }))
    const actions$ = xs.of((context: Context) => {
      expect(context.num).toBe(42)
      return action
    })
    const state = driver(actions$)

    let clicks = 0
    return new Promise((resolve, reject) => {
      state.$
        .addListener({
          next(state) {
            expect(state.clicks).toEqual(clicks)
            clicks++
          },
          error: reject,
          complete: () => {
            expect(clicks).toEqual(2)
            resolve()
          },
        })
    })
  })

  it('mergeMiddlewares should work', () => {
    function middleware1(action: Action): Stream<Action> {
      expect(action).toEqual({ type: 'Inc' })
      return xs.of(action)
    }

    function middleware2(action: Action): Stream<Action> {
      expect(action).toEqual({ type: 'Inc' })
      return xs.of(action)
    }

    const middleware = mergeMiddlewares(middleware1, middleware2)

    const driver = makeStateDriver(initialState, actions, reducer, middleware)
    const actions$ = xs.of({ type: 'Inc' })
    const state = driver(actions$)

    let clicks = 0
    return new Promise((resolve, reject) => {
      state.$
        .addListener({
          next(state) {
            expect(state.clicks).toEqual(clicks)
            clicks++
          },
          error: reject,
          complete: () => {
            expect(clicks).toEqual(2)
            resolve()
          },
        })
    })
  })
})
