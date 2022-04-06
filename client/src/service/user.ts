import { useQuery } from "react-query";
import { User } from "../entities";
import { useHttp } from "../libs/http";

const baseUrl = "api";

const lsKey = "__auth_token__";

export const getToken = () => window.localStorage.getItem(lsKey);

export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(lsKey, user.token || "");
  return user;
};

export const login = (data: { username: string; password: string }) => {
  return fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    } else {
      return Promise.reject(await res.json());
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  return fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      return Promise.reject(await response.json());
    }
  });
};

export const logout = async () => window.localStorage.removeItem(lsKey);

export const useUsers = (params?: Partial<User>) => {
  const client = useHttp();

  return useQuery<User[]>(["users", params], () =>
    client("users", { data: params })
  );
};
