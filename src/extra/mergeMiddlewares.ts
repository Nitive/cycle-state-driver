import xs, { Stream } from 'xstream'

import { Middleware } from '..'


export interface MergeMiddlewaresSignature {
  <A1, A2, A3>(
    middleware1: Middleware<A1 | A2 | A3, A2 | A3>,
    middleware2: Middleware<A2 | A3, A3>,
  ): Middleware<A1 | A2 | A3, A3>

  <A1, A2, A3, A4>(
    middleware1: Middleware<A1 | A2 | A3 | A4, A2 | A3 | A4>,
    middleware2: Middleware<A2 | A3 | A4, A3 | A4>,
    middleware3: Middleware<A3 | A4, A4>,
  ): Middleware<A1 | A2 | A3 | A4, A4>

  <A1, A2, A3, A4, A5>(
    middleware1: Middleware<A1 | A2 | A3 | A4 | A5, A2 | A3 | A4 | A5>,
    middleware2: Middleware<A2 | A3 | A4 | A5, A3 | A4 | A5>,
    middleware3: Middleware<A3 | A4 | A5, A4 | A5>,
    middleware4: Middleware<A4 | A5, A5>,
  ): Middleware<A1 | A2 | A3 | A4 | A5, A5>

  <A1, A2, A3, A4, A5, A6>(
    middleware1: Middleware<A1 | A2 | A3 | A4 | A5 | A6, A2 | A3 | A4 | A5 | A6>,
    middleware2: Middleware<A2 | A3 | A4 | A5 | A6, A3 | A4 | A5 | A6>,
    middleware3: Middleware<A3 | A4 | A5 | A6, A4 | A5 | A6>,
    middleware4: Middleware<A4 | A5 | A6, A5 | A6>,
    middleware5: Middleware<A5 | A6, A6>,
  ): Middleware<A1 | A2 | A3 | A4 | A5 | A6, A6>

  <A1, A2, A3, A4, A5, A6, A7>(
    middleware1: Middleware<A1 | A2 | A3 | A4 | A5 | A6 | A7, A2 | A3 | A4 | A5 | A6 | A7>,
    middleware2: Middleware<A2 | A3 | A4 | A5 | A6 | A7, A3 | A4 | A5 | A6 | A7>,
    middleware3: Middleware<A3 | A4 | A5 | A6 | A7, A4 | A5 | A6 | A7>,
    middleware4: Middleware<A4 | A5 | A6 | A7, A5 | A6 | A7>,
    middleware5: Middleware<A5 | A6 | A7, A6 | A7>,
    middleware6: Middleware<A6 | A7, A7>,
  ): Middleware<A1 | A2 | A3 | A4 | A5 | A6| A7, A7>

  <A1, A2, A3, A4, A5, A6, A7, A8>(
    middleware1: Middleware<A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8, A2 | A3 | A4 | A5 | A6 | A7 | A8>,
    middleware2: Middleware<A2 | A3 | A4 | A5 | A6 | A7 | A8, A3 | A4 | A5 | A6 | A7 | A8>,
    middleware3: Middleware<A3 | A4 | A5 | A6 | A7 | A8, A4 | A5 | A6 | A7 | A8>,
    middleware4: Middleware<A4 | A5 | A6 | A7 | A8, A5 | A6 | A7 | A8>,
    middleware5: Middleware<A5 | A6 | A7 | A8, A6 | A7 | A8>,
    middleware6: Middleware<A6 | A7 | A8, A7 | A8>,
    middleware7: Middleware<A7 | A8, A8>,
  ): Middleware<A1 | A2 | A3 | A4 | A5 | A6| A7 | A8, A8>

  <A1, A2, A3, A4, A5, A6, A7, A8, A9>(
    middleware1: Middleware<A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9, A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9>,
    middleware2: Middleware<A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9, A3 | A4 | A5 | A6 | A7 | A8 | A9>,
    middleware3: Middleware<A3 | A4 | A5 | A6 | A7 | A8 | A9, A4 | A5 | A6 | A7 | A8 | A9>,
    middleware4: Middleware<A4 | A5 | A6 | A7 | A8 | A9, A5 | A6 | A7 | A8 | A9>,
    middleware5: Middleware<A5 | A6 | A7 | A8 | A9, A6 | A7 | A8 | A9>,
    middleware6: Middleware<A6 | A7 | A8 | A9, A7 | A8 | A9>,
    middleware7: Middleware<A7 | A8 | A9, A8 | A9>,
    middleware8: Middleware<A8 | A9, A9>,
  ): Middleware<A1 | A2 | A3 | A4 | A5 | A6| A7 | A8 | A9, A9>

  (...middlewares: Middleware<any, any>[]): Middleware<any, any>
}


/**
  * Composes few middlewares into one
  *
  * Example:
  *
  * ```js
  * const middleware = mergeMiddlewares(
  *   createPassContextMiddleware(context),
  *   flatStreamMiddleware,
  * )
  * ```
  */
const mergeMiddlewares: MergeMiddlewaresSignature = ((...middlewares: Middleware<any, any>[]) => {
  return function middleware(action: any): Stream<any> {
    return middlewares.reduce(
      (acc$, middleware) => acc$.map(middleware).flatten(),
      xs.of(action),
    )
  }
})

export default mergeMiddlewares