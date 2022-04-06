import AuthenticatedApp from "./authenticated-app";
import { useAuth } from "./hooks/ctx";
import { UnauthenticatedApp } from "./unauthenticated-app/index";

export default function App() {
  const { user } = useAuth();

  return <div>{user ? <AuthenticatedApp /> : <UnauthenticatedApp />}</div>;
}
