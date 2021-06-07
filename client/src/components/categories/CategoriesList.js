import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
  EditButton,
} from "react-admin";
import authProvider from "../../authProvider";

const CategoriesList = (props) => {
  const [permission, setPermissions] = useState("");
  useEffect(() => {
    authProvider
      .getPermissions()
      .then((permission) => setPermissions(permission));
  }, "none");
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <TextField source="name" />
        {permission == "admin" && (
          <EditButton basePath="/categories" label="Edit" />
        )}
      </Datagrid>
    </List>
  );
};
export default CategoriesList;
