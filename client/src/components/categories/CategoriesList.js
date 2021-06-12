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
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <TextField source="name" />
        {props.permissions == "admin" && (
          <EditButton basePath="/categories" label="Edit" />
        )}
      </Datagrid>
    </List>
  );
};
export default CategoriesList;
