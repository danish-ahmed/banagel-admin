import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";
import RichTextInput from "ra-input-rich-text";

export default function UserEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" label="Name" />
        <TextInput source="password" label="Password" />
      </SimpleForm>
    </Edit>
  );
}
