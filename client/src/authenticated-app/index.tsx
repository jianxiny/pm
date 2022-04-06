import styled from "@emotion/styled";
import { Button, Dropdown, Menu } from "antd";
import { Route, Routes } from "react-router-dom";
import { ButtonNoPadding, Line } from "../components/page-state";
import { ProjectModal } from "../components/project-modal";
import { UserPop } from "../components/user-pop";
import { useAuth } from "../hooks/ctx";
import { resetRoute } from "../utiles";
import { Project } from "./project";
import { Projects } from "./projects";

export default function AuthenticatedApp() {
  return (
    <Container>
      <PageHeader />
      <Main>
        <Routes>
          <Route path={"projects"} element={<Projects />} />
          <Route path={"projects/:projectId/*"} element={<Project />} />
          <Route index element={<Projects />} />
        </Routes>
      </Main>
      <ProjectModal />
    </Container>
  );
}

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          PM
        </ButtonNoPadding>
        <UserPop />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"logout"}>
            <Button onClick={logout as any} type={"link"}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Line)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Line)``;
const HeaderRight = styled.div``;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
