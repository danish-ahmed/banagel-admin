import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

export default function SegmentEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name.en" label="Name in English" />
        <TextInput source="name.de" label="Name in German" />
      </SimpleForm>
    </Edit>
  );
}
