import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";

const SubCategoriesList = (props) => {
  const locale = useLocale();

  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <TextField source={`category.name.${locale}`} label="Main Category" />
        <TextField source={`name.${locale}`} label="Category" />
        {props.permissions === "admin" && (
          <EditButton basePath="/subcategories" label="Edit" />
        )}

        {props.permissions === "admin" && (
          <DeleteButton basePath="/subcategories" label="Delete" />
        )}
      </Datagrid>
    </List>
  );
};
export default SubCategoriesList;
