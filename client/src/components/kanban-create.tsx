import { Input } from "antd";
import { useState } from "react";
import { useAddKanban } from "../utiles/kanban";
import { useKanbanQueryKey, useProjectIdInURL } from "../utiles/url";
import { Container } from "./kanban-column";

export const KanbanCreate = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInURL();
  const { mutateAsync: addKanban } = useAddKanban(useKanbanQueryKey());

  const submit = async () => {
    await addKanban({ name, projectId });
    setName("");
  };

  return (
    <Container>
      <Input
        size={"large"}
        placeholder={"新建看板名称"}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Container>
  );
};
