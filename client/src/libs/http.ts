import qs from "qs";
import { useCallback } from "react";
import { useAuth } from "../hooks/ctx";
import * as auth from "../service/user";

const baseUrl = "/api";

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

// just handle 401
export const http = async (
  endpoint: string,
  { data, token, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      "x-auth": token ? `${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  return fetch(`${baseUrl}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      location.href = "/";
      return Promise.reject({ message: "请重新登录" });
    }
    // fetch succ
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};
