import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  ShowButton,
  DeleteButton,
  useLocale,
} from "react-admin";
import ProductFilters from "./ProductFilters";
const ProductList = (props) => {
  const locale = useLocale();
  return (
    <List {...props} aside={<ProductFilters />}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source={`name.${locale}`} label="Name" />
        <TextField source={`category.name.${locale}`} label="Category" />
        <TextField
          source={`category.category.name.${locale}`}
          label="SubCategory"
        />

        <TextField source="price" />
        <ImageField source="image" title="name" label="Image" />
        {props.permissions === "admin" && (
          <EditButton basePath="/products" label="Edit" />
        )}
        {props.permissions === "admin" && (
          <DeleteButton basePath="/products" label="Delete" />
        )}

        <ShowButton basePath="/products" label="Show" />
      </Datagrid>
    </List>
  );
};
export default ProductList;
