import xs, { Stream } from 'xstream'

/**
 * Creates middleware that calls action with given context if action is a function
 *
 * Action creator example:
 *
 * ```js
 * export function asyncAction(speed?: number) {
 *  return ({ defaults }: ActionContext): Action => {
 *    return { type: 'Move', payload: { speed: speed || defaults.speed } }
 *  }
 *}
 *
 * Usage with flatStreamMiddleware:
 *
 * ```js
 * export function asyncAction() {
 *   return ({ api }: ActionContext) => xs.merge(
 *     xs.of<Action>({ type: 'RequestPending' }),
 *     api.getData()
 *       .map<Action>(data => ({ type: 'RequestSuccess', data }))
 *       .replaceError(error => xs.of<Action>({ type: 'RequestErrored', error })),
 *   )
 * }
 * ```
 */
export default function createPassContextMiddleware<C>(context: C) {
  return function passContextMiddleware<A>(action: A | ((ctx: C) => A)): Stream<A> {
    return xs.of(typeof action === 'function' ? action(context) : action)
  }
}
