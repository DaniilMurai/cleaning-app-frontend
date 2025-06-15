// Internal types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuccessCallback<T = any> = (result: T) => void;
type ErrorCallback = (error: unknown) => void;

/*
 * Used when multiple React UI fragments attempt an action that needs to be performed only once
 * Javascript is single threaded, so we do not need to lock as in other languages
 */
export default class ConcurrentActionHandler {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _callbacks: [SuccessCallback, ErrorCallback][];

	public constructor() {
		this._callbacks = [];
	}

	/*
	 * Run the supplied action once and return a promise while in progress
	 */
	public async execute<T>(action: () => Promise<T>): Promise<T> {
		// Create a promise through which to return the result
		const promise = new Promise<T>((resolve, reject) => {
			const onSuccess = (result: T) => {
				resolve(result);
			};

			const onError = (error: unknown) => {
				reject(error);
			};

			this._callbacks.push([onSuccess, onError]);
		});

		// Only do the work for the first UI view that calls us
		const performAction = this._callbacks.length === 1;
		if (performAction) {
			try {
				// Do the work
				const result = await action();

				// On success resolve all promises
				this._callbacks.forEach(c => {
					c[0](result);
				});
			} catch (e: unknown) {
				// On failure resolve all promises with the same error
				this._callbacks.forEach(c => {
					c[1](e);
				});
			}

			// Reset once complete
			this._callbacks = [];
		}

		// Return the promise
		return promise;
	}
}
