import React, { useState, useEffect } from "react";
import { List, Datagrid, TextField, EditButton } from "react-admin";
import authProvider from "../../authProvider";

const SubCategoriesList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <TextField source="name" />
        {props.permissions == "admin" && (
          <EditButton basePath="/subcategories" label="Edit" />
        )}
      </Datagrid>
    </List>
  );
};
export default SubCategoriesList;
