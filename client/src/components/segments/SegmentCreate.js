import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

export default function SegmentCreate(props) {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" label="Name in English" />
        <TextInput source="name_de" label="Name in German" />
      </SimpleForm>
    </Create>
  );
}
