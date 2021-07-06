import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export default function CategoriesEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name.en" label="Name in English" />
        <TextInput source="name.de" label="Name in German" />
        <ReferenceInput label="Segment" source="segment" reference="segments">
          <SelectInput optionText="name.en" optionValue="_id" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
}
