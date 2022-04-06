import { Button, Input } from "antd";
import { useTaskTypes } from "../service/task";
import { useTasksSearchParams } from "../utiles/tasks";
import { useSetURLSearchParam } from "../utiles/url";
import { IdSelect } from "./id-select";
import { Line } from "./page-state";
import { UserSelect } from "./project-filter";

export const TaskFilter = () => {
  const searchParams = useTasksSearchParams();
  const setSearchParams = useSetURLSearchParam();
  const reset = () => {
    setSearchParams({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };

  return (
    <Line marginBottom={4} gap={true}>
      <Input
        style={{ width: "20rem" }}
        placeholder={"任务名"}
        value={searchParams.name as string}
        onChange={(evt) => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={"经办人"}
        value={searchParams.processorId}
        onChange={(value: any) => setSearchParams({ processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={"类型"}
        value={searchParams.typeId}
        onChange={(value: any) => setSearchParams({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Line>
  );
};

export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: taskTypes } = useTaskTypes();
  return <IdSelect options={taskTypes || []} {...props} />;
};
