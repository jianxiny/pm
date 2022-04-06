import { useEffect, useRef } from "react";
export { useProjectModal } from "./project";

export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  const old = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = old;
      }
    };
  }, [keepOnUnmount, old]);
};

// to home page
export const resetRoute = () => (window.location.href = window.location.origin);

export const removeVoid = (o: any) => {
  if (!o) return {};
  const cn = { ...o };

  Object.keys(cn).forEach((key) => {
    const v = cn[key];
    if (isVoid(v)) delete cn[key];
  });
  return cn;
};

function isVoid(o: any) {
  return o == null || o === "";
}

export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries);
};
