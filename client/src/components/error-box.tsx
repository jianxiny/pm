import { Typography } from "antd";

const isError = (value: any) => {
  if (value == null) return false;
  return Object.hasOwn(value, "message");
};

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return (
      <Typography.Text type="danger">
        {(error as Error)?.message}
      </Typography.Text>
    );
  }
  return null;
};
