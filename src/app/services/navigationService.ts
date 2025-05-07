// navigationService.ts
type NavigationHandler = (path: string) => void;

class NavigationService {
	private static handler: NavigationHandler | null = null;

	static setHandler(handler: NavigationHandler) {
		this.handler = handler;
	}

	static navigate(path: string) {
		if (this.handler) {
			this.handler(path);
		}
	}
}

export default NavigationService;
