import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";

const UserList = (props) => {
  const locale = useLocale();
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" label="Name" />
        {props.permissions === "admin" && (
          <EditButton basePath="/users" label="Edit" />
        )}
      </Datagrid>
    </List>
  );
};
export default UserList;
