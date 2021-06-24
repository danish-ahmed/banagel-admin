import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ImageField,
  EditButton,
} from "react-admin";

export default function ShopShow(props) {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="shopname" />
        <TextField source="commercialID" />
        <TextField source="phone" />
        <TextField source="address" />
        <ImageField source="filename" title="shopname" label="Image" />
        <TextField source="owner.firstname" label="Owner" />
        <EditButton basePath="/shops" label="" />
      </SimpleShowLayout>
    </Show>
  );
}
