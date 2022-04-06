import { Form, Input } from "antd";
import { Project, User } from "../entities";
import { useUsers } from "../service/user";
import { IdSelect } from "./id-select";

interface FilterProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: FilterProps["param"]) => void;
}

export const ProjectFilter = ({ param, setParam }: FilterProps) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        <Input
          placeholder={"项目名"}
          type="text"
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={"负责人"}
          value={param.personId}
          onChange={(value: any) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        />
      </Form.Item>
    </Form>
  );
};

export const UserSelect = (props: any) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props} />;
};
