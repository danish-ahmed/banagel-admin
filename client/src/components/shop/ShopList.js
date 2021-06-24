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
        {props.permissions === "member" && (
          <>
            <EditButton basePath="/shops" label="Edit" />
            <DeleteButton basePath="/shops" label="Delete" />
            <ShowButton basePath="/shops" label="Show" />
          </>
        )}
      </Datagrid>
    </List>
  );
};
export default ShopList;
