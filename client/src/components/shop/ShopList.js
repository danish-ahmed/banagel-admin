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
import ShopFilter from "./ShopFilters";
const ShopList = (props) => {
  const locale = useLocale();
  const segment = `segment.name.${locale}`;
  return (
    <List {...props} aside={<ShopFilter />}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source={`shopname.${locale}`} label="Shopname" />
        <TextField source="commercialID" />
        <TextField source={segment} label="Segment" />
        <TextField source="phone" />
        <TextField source="address" />
        <ImageField source="filename" title="shopname" label="Image" />
        <TextField source="owner.firstname" label="Owner" />
        <EditButton basePath="/shops" label="Edit" />
        <ShowButton basePath="/shops" label="Show" />

        {props.permissions === "admin" && (
          <DeleteButton basePath="/shops" label="Delete" />
        )}
      </Datagrid>
    </List>
  );
};
export default ShopList;
