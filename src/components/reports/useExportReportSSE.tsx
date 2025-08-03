import { useEffect } from "react";
import { ApiUrl } from "@/constants";
import { getGetExportReportsQueryKey, getStreamExportReportsQueryKey } from "@/api/admin";
import { AccessTokenStorage } from "@/core/auth/storage";
import { useQueryClient } from "@tanstack/react-query";

const LIMIT = 5;
const RECONNECT_DELAY = 3000;

export default function useExportReportSSE() {
	const queryClient = useQueryClient();

	//TODO если не будет токена нужно его обновить, хз как это сделать
	useEffect(() => {
		let controller: AbortController | null = null;
		let stopped = false;
		let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

		const connect = async () => {
			if (stopped) return;

			controller = new AbortController();
			const token = await AccessTokenStorage.get();

			try {
				const res = await fetch(`${ApiUrl}${getStreamExportReportsQueryKey()}`, {
					method: "GET",
					headers: {
						Authorization: `${token}`,
						Accept: "text/event-stream",
					},
					signal: controller.signal,
				});

				const reader = res.body?.getReader();
				const decoder = new TextDecoder("utf-8");
				if (!reader) return;

				let buffer = "";

				while (true) {
					const { value, done } = await reader.read();
					if (done) break; // сервер закрыл соединение

					buffer += decoder.decode(value, { stream: true });
					const parts = buffer.split("\n\n");

					if (parts.length > 1) {
						const queryKey = getGetExportReportsQueryKey({ limit: LIMIT });
						await queryClient.invalidateQueries({ queryKey });
					}

					buffer = parts[parts.length - 1];
				}

				if (!stopped) {
					reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
				}
			} catch (err) {
				if ((err as DOMException).name !== "AbortError") {
					console.error("Ошибка SSE:", err);
					if (!stopped) {
						reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
					}
				}
			}
		};

		connect();

		return () => {
			stopped = true;
			if (controller) controller.abort();
			if (reconnectTimeout) clearTimeout(reconnectTimeout);
		};
	}, []);
}
