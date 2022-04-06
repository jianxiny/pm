import { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { removeVoid, subset } from ".";
import { useProject } from "../service/project";

/**
 * accept keys(string) return value in search params, and a set url search params func
 */
export const useURLQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetURLSearchParam();

  const [stateKeys] = useState(keys);

  return [
    useMemo(
      () => subset(Object.fromEntries(searchParams), stateKeys),
      [searchParams, stateKeys]
    ),
    (params: any) => {
      return setSearchParams(params);
    },
  ] as const;
};

/**
 * set url search params with remove invalid property
 */
export const useSetURLSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();

  return (params: any) => {
    const o = removeVoid({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParams;
    setSearchParam(o);
  };
};

export const useProjectsSearchParams = () => {
  const [param, setParam] = useURLQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectIdInURL = () => {
  const { pathname } = useLocation();
  const rawID = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(rawID);
};

export const useProjectInURL = () => useProject(useProjectIdInURL());
export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params];
};

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInURL() });
export const useKanbanQueryKey = () => ["kanbans", useKanbanSearchParams()];
