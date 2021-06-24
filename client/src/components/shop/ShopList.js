import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  ShowButton,
  useLocale,
  DeleteButton,
} from "react-admin";

const ShopList = (props) => {
  const locale = useLocale();
  const category = `category.name.${locale}`;
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source={`shopname.${locale}`} label="Shopname" />
        <TextField source="commercialID" />
        <TextField source={category} label="category" />
        <TextField source="phone" />
        <TextField source="address" />
        <ImageField source="filename" title="shopname" label="Image" />
        <TextField source="owner.firstname" label="Owner" />
        <EditButton basePath="/shops" label="Edit" />
        <ShowButton basePath="/shops" label="Show" />

        {props.permissions === "admin" && (
          <>
            <DeleteButton basePath="/shops" label="Delete" />
          </>
        )}
      </Datagrid>
    </List>
  );
};
export default ShopList;
