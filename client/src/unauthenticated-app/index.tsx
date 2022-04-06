import { useState } from "react";
import { useDocumentTitle } from "../utiles";

import { ErrorBox } from "../components/error-box";
import { Register } from "./register";
import styled from "@emotion/styled";
import { Card } from "antd";
import { Login } from "./login";

export function UnauthenticatedApp() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useDocumentTitle("Please login or register to continue");

  return (
    <>
      <ShadowCard>
        <div className="card-title my-2 pb-5 test-lg text-blue-500">
          {isRegister ? "请注册" : "请登录"}
        </div>
        <ErrorBox error={error} />
        {isRegister ? (
          <Register onError={setError} />
        ) : (
          <Login onError={setError} />
        )}
      </ShadowCard>
    </>
  );
}
const ShadowCard = styled(Card)`
  width: 40rem;
  max-height: 40vh;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
  margin: 20vh auto;
`;
