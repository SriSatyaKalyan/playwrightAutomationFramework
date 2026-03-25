/**
 * Shared logger utility for the test automation framework
 * Provides consistent logging across tests, page objects, and utilities
 */

class Logger {
	private getTimestamp(): string {
		return new Date().toISOString();
	}

	private formatMessage(level: string, message: string, extra?: any): string {
		const timestamp = this.getTimestamp();
		const baseMessage = `[${timestamp}] [${level}] ${message}`;

		if (extra) {
			return `${baseMessage} ${JSON.stringify(extra, null, 2)}`;
		}

		return baseMessage;
	}

	info(message: string, extra?: any): void {
		console.log(this.formatMessage("INFO", message, extra));
	}

	warn(message: string, extra?: any): void {
		console.warn(this.formatMessage("WARN", message, extra));
	}

	error(message: string, extra?: any): void {
		console.error(this.formatMessage("ERROR", message, extra));
	}

	debug(message: string, extra?: any): void {
		if (process.env.DEBUG) {
			console.debug(this.formatMessage("DEBUG", message, extra));
		}
	}
}

export const logger = new Logger();
