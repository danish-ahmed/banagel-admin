import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
  EditButton,
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
        <TextField source="id" />
        <TextField source="shopname" />
        <TextField source="commercialID" />
        <TextField source="owner" />
        <EditButton basePath="/shops" label="" />
      </Datagrid>
    </List>
  );
};
export default ShopsList;
