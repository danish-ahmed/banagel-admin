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
        <TextField source="shopname.en" />
        <TextField source="shopname.de" />
        <TextField source="commercialID" />
        <TextField source="phone" />
        <TextField source="address" />
        <ImageField source="logo" title="shopname" label="Logo" />
        <ImageField
          source="landingImage"
          title="shopname"
          label="Landing Image"
        />
        <ImageField
          source="filename"
          title="shopname"
          label="Menu/Price List"
        />
        <TextField source="owner.firstname" label="Owner" />
        <EditButton basePath="/shops" label="" />
      </SimpleShowLayout>
    </Show>
  );
}
