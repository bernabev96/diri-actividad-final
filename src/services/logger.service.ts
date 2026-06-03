export const logger = {
  info(message: string, data?: unknown) {
    console.info(`[INFO] ${message}`, data ?? '');
  },
  error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`, error ?? '');
  },
};
