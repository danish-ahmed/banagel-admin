import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";
import RichTextInput from "ra-input-rich-text";

export default function SegmentEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name.en" label="Name in English" />
        <TextInput source="name.de" label="Name in German" />
        <RichTextInput source="description" label="Description" />
      </SimpleForm>
    </Edit>
  );
}
