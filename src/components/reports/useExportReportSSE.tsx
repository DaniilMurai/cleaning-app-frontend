import { useEffect } from "react";
import { ApiUrl } from "@/constants";
import { getGetExportReportsQueryKey, getStreamExportReportsQueryKey } from "@/api/admin";
import { AccessTokenStorage } from "@/core/auth/storage";
import { useQueryClient } from "@tanstack/react-query";

const LIMIT = 5;

export default function useExportReportSSE() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const controller = new AbortController();
		//TODO если не будет токена нужно его обновить, хз как это сделать
		AccessTokenStorage.get().then(response => {
			fetch(`${ApiUrl}${getStreamExportReportsQueryKey()}`, {
				method: "GET",
				headers: { Authorization: `${response}`, Accept: "text/event-stream" },
				signal: controller.signal,
			}).then(response => {
				const reader = response.body?.getReader();
				const decoder = new TextDecoder("utf-8");
				if (!reader) return;

				let buffer = "";

				const read = async () => {
					try {
						while (true) {
							const { value, done } = await reader.read();
							if (done) break;

							buffer += decoder.decode(value, { stream: true });
							const parts = buffer.split("\n\n");

							if (parts.length > 1) {
								const queryKey = getGetExportReportsQueryKey({ limit: LIMIT });
								await queryClient.invalidateQueries({ queryKey });
							}

							buffer = parts[parts.length - 1];
							setTimeout(() => {}, 1000);
						}
					} catch (err) {
						if ((err as DOMException).name !== "AbortError") {
							console.error("Произошла ошибка при чтении SSE: ", err);
						}
					}
				};
				read();
			});
		});

		return () => {
			controller.abort();
		};
	}, []);
}
