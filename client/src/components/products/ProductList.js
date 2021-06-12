import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  ShowButton,
} from "react-admin";

const ProductList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source="name" />
        <TextField source="category.name" label="Category" />
        <TextField source="price" />
        <ImageField source="image" title="name" label="Image" />
        {props.permissions == "admin" && (
          <EditButton basePath="/products" label="Edit" />
        )}
        <ShowButton basePath="/products" label="Show" />
      </Datagrid>
    </List>
  );
};
export default ProductList;
