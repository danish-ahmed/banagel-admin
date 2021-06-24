import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";

const CategoriesList = (props) => {
  const locale = useLocale();
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source={`name.${locale}`} label="Name" />
        {props.permissions === "admin" && (
          <EditButton basePath="/categories" label="Edit" />
        )}
        {props.permissions === "admin" && (
          <DeleteButton basePath="/categories" label="Delete" />
        )}
      </Datagrid>
    </List>
  );
};
export default CategoriesList;
