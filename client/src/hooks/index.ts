import { useEffect, useState } from "react";

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, [callback]);
};

export const useDebounce = <T>(value: T, delay?: number) => {
  const [dv, setDv] = useState(value);

  useEffect(() => {
    const tid = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(tid);
  }, [value, delay]);

  return dv;
};
