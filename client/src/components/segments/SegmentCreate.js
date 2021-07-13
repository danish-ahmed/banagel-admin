import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";
import RichTextInput from "ra-input-rich-text";

export default function SegmentCreate(props) {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" label="Name in English" />
        <TextInput source="name_de" label="Name in German" />
        <RichTextInput source="description" label="Description" />
      </SimpleForm>
    </Create>
  );
}
