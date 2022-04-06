import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "./ctx";

interface State<T> {
  error: Error | null;
  data: T | null;
  state: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  state: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

// dispatch should called after mounted
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountRef.current ? dispatch(...args) : void 0),
    [dispatch, mountRef]
  );
};
export const useAsync = <T>(
  initialStat?: State<T>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };

  const [state, dispatch] = useReducer(
    (state: State<T>, action: Partial<State<T>>) => ({ ...state, ...action }),
    { ...defaultInitialState, ...initialStat }
  );

  const safeDispatch = useSafeDispatch(dispatch);

  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: T) =>
      safeDispatch({
        data,
        state: "success",
        error: null,
      }),
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        state: "error",
        data: null,
      }),
    [safeDispatch]
  );

  const run = useCallback(
    (promise: Promise<T>, runConfig?: { retry: () => Promise<T> }) => {
      if (!promise || !promise.then) {
        throw new Error("please input a promise type param");
      }

      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });

      safeDispatch({ state: "loading" });

      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((err) => {
          setError(err);
          if (config.throwOnError) return Promise.reject(err);
          return err;
        });
    },
    [config.throwOnError, setData, setError, safeDispatch]
  );
  return {
    isIdle: state.state === "idle",
    isLoading: state.state === "loading",
    isError: state.state === "error",
    isSuccess: state.state === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};
