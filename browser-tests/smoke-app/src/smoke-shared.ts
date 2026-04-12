type SmokeResult =
  | {
      status: 'loading';
    }
  | {
      status: 'ok';
      exports: string[];
      summary: Record<string, unknown>;
    }
  | {
      status: 'error';
      message: string;
      stack?: string;
    };

declare global {
  interface Window {
    __smoke?: SmokeResult;
  }
}

const statusElement = document.getElementById('status');

export const setSmokeResult = (result: SmokeResult) => {
  window.__smoke = result;
  if (statusElement) {
    statusElement.textContent = JSON.stringify(result);
  }
};

export const toErrorResult = (error: unknown): SmokeResult => {
  if (error instanceof Error) {
    return {
      status: 'error',
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    status: 'error',
    message: String(error),
  };
};
