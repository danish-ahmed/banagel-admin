import React, { useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
  EditButton,
} from "react-admin";
import authProvider from "../../authProvider";

const ShopFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search Shop Name" source="shopname" />
    <TextInput label="Commercial Id" source="CommercialID" defaultValue="" />
  </Filter>
);

const CategoriesList =  async (props) => {
  const [permission, getPermissions] = useState("");
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="_id" />
        <TextField source="name" />
        {/* {permission == "admin" && <EditButton basePath="/shops" label="" />} */}
      </Datagrid>
    </List>
  );
};
export default CategoriesList;
