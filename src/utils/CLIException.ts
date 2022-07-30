export enum LogLevel {
	info = 1,
	severe = 2,
	warn = 3,
	error = 4,
}

export class CLIException extends Error {
	error!: string
	errored_from!: string
	static logLevel: LogLevel = LogLevel.error
	constructor(_error: string, _errored_from: string) {
		super(_error)
		this.error = _error
		this.errored_from = _errored_from
		Object.setPrototypeOf(this, CLIException.prototype)
	}

	public logError() {
		if (CLIException.logLevel <= 2) {
			console.error('Failed at:', this.errored_from)
		}
		console.error(this.error)
	}
}
