import React, { useState } from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

export const ShopEdit = (props) => {
  const [value, setValue] = useState(null);

  return (
    <Edit title="Edit Shop" {...props}>
      <SimpleForm>
        <TextInput disabled label="Id" source="id" />
        <TextInput source="shopname" />
        <TextInput source="phone" />
        <TextInput source="address" />

        {/* <GooglePlacesAutocomplete
          selectProps={{
            value,
            onChange: setValue,
          }}
          source="address"
        /> */}
      </SimpleForm>
    </Edit>
  );
};

export default ShopEdit;
