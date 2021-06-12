import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  ShowButton,
} from "react-admin";

const ShopList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source="shopname" />
        <TextField source="commercialID" />
        <TextField source="phone" />
        <TextField source="address" />
        <ImageField source="filename" title="shopname" label="Image" />
        <TextField source="owner.firstname" label="Owner" />
        <EditButton basePath="/shops" label="Edit" />
        <ShowButton basePath="/shops" label="Show" />
      </Datagrid>
    </List>
  );
};
export default ShopList;
