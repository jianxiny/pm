import { BugOutlined, EditTwoTone } from "@ant-design/icons";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { forwardRef } from "react";
import { Kanban, Task } from "../entities";
import { useTasks, useTaskTypes } from "../service/task";
import { useDeleteKanban } from "../utiles/kanban";
import { useTasksModal, useTasksSearchParams } from "../utiles/tasks";
import { Drag, Drop, DropChild } from "./drag-and-drop";
import { Line } from "./page-state";
import { TaskCreate } from "./task-create";

import { useKanbanQueryKey } from "../utiles/url";
import styled from "@emotion/styled";

export const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) {
    return <>{name}</>;
  }
  const arr = name.split(keyword);
  return (
    <>
      {arr.map((str, index) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : (
            <span style={{ color: "#257AFD" }}>{keyword}</span>
          )}
        </span>
      ))}
    </>
  );
};

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  const content = name === "bug" ? <BugOutlined /> : <EditTwoTone />;
  return content;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();
  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      key={task.id}
    >
      <p>
        <Mark keyword={keyword as string} name={task.name} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const KanbanColumn = forwardRef<HTMLDivElement, { kanban: Kanban }>(
  ({ kanban, ...props }, ref) => {
    const { data: allTasks } = useTasks(useTasksSearchParams() as any);
    const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
    return (
      <Container {...props} ref={ref}>
        <Line between={true}>
          <h3>{kanban.name}</h3>
          <More kanban={kanban} key={kanban.id} />
        </Line>
        <TasksContainer>
          <Drop
            type={"ROW"}
            direction={"vertical"}
            droppableId={String(kanban.id)}
          >
            <DropChild style={{ minHeight: "1rem" }}>
              {tasks?.map((task, taskIndex) => (
                <Drag
                  key={task.id}
                  index={taskIndex}
                  draggableId={"task" + task.id}
                >
                  <div>
                    <TaskCard key={task.id} task={task} />
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
          <TaskCreate kanbanId={kanban.id} />
        </TasksContainer>
      </Container>
    );
  }
);

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbanQueryKey());
  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={"link"} onClick={startDelete}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;
