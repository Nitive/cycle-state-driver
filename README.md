# cycle-state-driver
[![Build Status](https://travis-ci.org/Nitive/cycle-state-driver.svg?branch=travis)](https://travis-ci.org/Nitive/cycle-state-driver)
[![Code Climate](https://codeclimate.com/github/Nitive/cycle-state-driver/badges/gpa.svg)](https://codeclimate.com/github/Nitive/cycle-state-driver)
[![Test Coverage](https://codeclimate.com/github/Nitive/cycle-state-driver/badges/coverage.svg)](https://codeclimate.com/github/Nitive/cycle-state-driver/coverage)
[![Issue Count](https://codeclimate.com/github/Nitive/cycle-state-driver/badges/issue_count.svg)](https://codeclimate.com/github/Nitive/cycle-state-driver)

> Redux-like state driver for Cycle.js

Note: All examples has written with TypeScript.
You can use `cycle-state-driver` without TypeScript as well.

Write actions and reducer just like in Redux:

```typescript
// actions.ts
type Action
  = { type: 'Inc' }
  | { type: 'Dec' }

function inc(): Action {
  return { type: 'Inc' }
}

function dec(): Action {
  return { type: 'Dec' }
}


// reducer.ts
interface State {
  count: number,
}

function (state: State, action: Action): State {
  switch(action.type) {
    case 'Inc': {
      return {
        ...state,
        count: state.count + 1,
      }
    }

    case 'Dec': {
      return {
        ...state,
        count: state.count - 1,
      }
    }
  }
}
```

Connect driver just like any other driver for Cycle.js

```typescript
import * as actions from './actions'

export interface Sources {
  DOM: DOMSource,
  state: StateSource<State, actions.Action, typeof actions>,
}

export interface Sinks {
  DOM: Stream<VNode>,
  state: Stream<Action>,
}

function main(sources: Sources): Sinks {
  // ...
}

run(main, {
  DOM: makeDOMDriver('#app'),
  state: makeStateDriver(initialState, actions, reducer),
})
```

Use driver:

```typescript
function main(sources: Sources): Sinks {
  // Make Virtual DOM depends on state
  const vdom$ = sources.state.$.map(state => {
    return div([
      span(`count: ${state.$.count}`),
      button('.inc', '+'),
      button('.dec', '-'),
    ])
  })

  // All actions typed
  // You can not dispatch not defined action
  const { actions } = sources.state
  const action$ = xs.merge(
    sources.DOM.select('.inc').events('click').mapTo(actions.inc()),
    sources.DOM.select('.dec').events('click').mapTo(actions.dec()),
  )

  return {
    DOM: vdom$,
    state: action$,
  }
}
```
