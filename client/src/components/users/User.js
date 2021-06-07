import React from "react";
import { List, Datagrid, TextField, EditButton } from "react-admin";

const User = (props) => {
  return (
    <List {...props}>
      <Datagrid></Datagrid>
    </List>
  );
};
export default User;
