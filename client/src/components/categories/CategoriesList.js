import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";
import CategoryFilter from "./CategoryFilter";

const CategoriesList = (props) => {
  const locale = useLocale();
  return (
    <List {...props} aside={<CategoryFilter />}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source={`segment.name.${locale}`} label="Segment" />
        <TextField source={`name.${locale}`} label="Category Name" />
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
