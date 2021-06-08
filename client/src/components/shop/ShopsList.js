import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
  EditButton,
  ImageField,
} from "react-admin";

const ShopFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search Shop Name" source="shopname" />
    <TextInput label="Commercial Id" source="CommercialID" defaultValue="" />
  </Filter>
);

const ShopsList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source="shopname" />
        <TextField source="commercialID" />
        <ImageField source="filename" title="shopname" label="Image" />
        <TextField source="owner.firstname" label="Owner" />
        <EditButton basePath="/shops" label="" />
      </Datagrid>
    </List>
  );
};
export default ShopsList;
