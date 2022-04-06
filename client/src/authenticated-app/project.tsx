import { Link } from "react-router-dom";
import { Route, Routes, useLocation } from "react-router";
import styled from "@emotion/styled";
import { Menu } from "antd";
import { Kanban } from "./kanban";

export const Project = () => {
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={["kanban"]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          {/*projects/:projectId/kanban*/}
          <Route path={"kanban"} element={<Kanban />} />
          <Route index element={<Kanban />} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  width: 100%;
`;
