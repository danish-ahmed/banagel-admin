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

const SubCategoriesList = (props) => {
  const locale = useLocale();

  return (
    <List {...props} aside={<CategoryFilter />}>
      <Datagrid>
        {/* <TextField source="_id" /> */}
        <TextField source={`category.segment.name.${locale}`} label="Segment" />
        <TextField source={`category.name.${locale}`} label="Category" />
        <TextField source={`name.${locale}`} label="SubCategory Name" />
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
