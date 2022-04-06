import { Container } from "../components/page-state";
import { useReorderTask, useTasks } from "../service/task";
import { useDocumentTitle } from "../utiles";
import { useKanbans, useReorderKanban } from "../utiles/kanban";
import {
  useKanbanQueryKey,
  useKanbanSearchParams,
  useProjectInURL,
} from "../utiles/url";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useTasksQueryKey, useTasksSearchParams } from "../utiles/tasks";
import { TaskFilter } from "../components/task-filter";
import { Spin } from "antd";
import { Drag, Drop, DropChild } from "../components/drag-and-drop";
import { KanbanColumn } from "../components/kanban-column";
import { KanbanCreate } from "../components/kanban-create";
import { TaskModal } from "../components/task-modal";
import { useCallback } from "react";
import styled from "@emotion/styled";

export const Kanban = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInURL();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams() as any);
  const isLoading = taskIsLoading || kanbanIsLoading;

  const onDragEnd = useDragEnd();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <h1>{currentProject?.name}看板</h1>
        <TaskFilter />
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <ColumnsContainer>
            <Drop
              type={"COLUMN"}
              direction={"horizontal"}
              droppableId={"kanban"}
            >
              <DropChild style={{ display: "flex" }}>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={"kanban" + kanban.id}
                    index={index}
                  >
                    <KanbanColumn kanban={kanban} key={kanban.id} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <KanbanCreate />
          </ColumnsContainer>
        )}
        <TaskModal />
      </Container>
    </DragDropContext>
  );
};

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbanQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams() as any);
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      console.log("drop type", type);
      if (!destination) {
        return;
      }
      // 看板排序
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ fromId, referenceId: toId, type });
      }
      if (type === "ROW") {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;
        const fromTask = allTasks.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTasks.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) {
          return;
        }
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? "after"
              : "before",
        });
      }
    },
    [kanbans, reorderKanban, allTasks, reorderTask]
  );
};

export const ColumnsContainer = styled("div")`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
