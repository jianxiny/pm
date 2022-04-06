import { ErrorBox } from "../components/error-box";
import { ButtonNoPadding, Container, Line } from "../components/page-state";
import { ProjectFilter } from "../components/project-filter";
import { ProjectTable } from "../components/project-table";
import { useDebounce } from "../hooks";
import { useProjects } from "../service/project";
import { useUsers } from "../service/user";
import { useDocumentTitle, useProjectModal } from "../utiles";
import { useProjectsSearchParams } from "../utiles/url";

export const Projects = () => {
  useDocumentTitle("项目列表", false);

  const { open } = useProjectModal();

  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Container>
      <Line marginBottom={2} between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type={"link"}>
          创建项目
        </ButtonNoPadding>
      </Line>
      <ProjectFilter users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <ProjectTable
        loading={isLoading}
        users={users || []}
        dataSource={list || []}
      />
    </Container>
  );
};
