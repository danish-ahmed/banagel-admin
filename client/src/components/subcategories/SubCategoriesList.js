import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  CreateButton,
} from "react-admin";
import authProvider from "../../authProvider";

const SubCategoriesList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <TextField source="category.name" label="Main Category" />
        <TextField source="name" label="Category" />
        {props.permissions == "admin" && (
          <EditButton basePath="/subcategories" label="Edit" />
        )}

        {props.permissions == "admin" && (
          <CreateButton basePath="/subcategories" label="Create" />
        )}
      </Datagrid>
    </List>
  );
};
export default SubCategoriesList;
