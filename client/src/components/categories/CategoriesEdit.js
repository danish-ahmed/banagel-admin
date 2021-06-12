import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

export default function CategoriesEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  );
}
