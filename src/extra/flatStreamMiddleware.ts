import xs, { Stream } from 'xstream'

function isStream<T>(stream: any): stream is Stream<T> {
  return stream instanceof Stream
}

/**
 * Middleware which flats Stream of actions
 *
 * Action creator example:
 *
 * ```js
 * export function initialize() {
 *   return xs.merge(
 *     xs.of<Action>({ type: 'InitializePending' }),
 *     xs.fromPromise(fetch('/get-data'))
 *       .map<Action>(data => ({ type: 'InitializeSuccess', data }))
 *       .replaceError(error => xs.of<Action>({ type: 'InitializeErrored', error })),
 *   )
 * ```
 */
export default function flatStreamMiddleware<A>(action: A | Stream<A>): Stream<A> {
  return isStream(action)
    ? action
    : xs.of(action)
}
