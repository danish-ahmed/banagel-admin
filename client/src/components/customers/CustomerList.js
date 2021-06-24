import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
} from "react-admin";

export default function CustomerList() {
  return (
    <div>
      <List {...props}>
        <Datagrid>
          <TextField source="_id" />
          <TextField source="name" />
        </Datagrid>
      </List>
    </div>
  );
}
