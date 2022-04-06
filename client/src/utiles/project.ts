import { useProject } from "../service/project";
import { useSetURLSearchParam, useURLQueryParam } from "./url";

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useURLQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useURLQueryParam([
    "editingProjectId",
  ]);
  const setUrlParams = useSetURLSearchParam();
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setUrlParams({ projectCreate: "", editingProjectId: "" });

  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
