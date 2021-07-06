import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export default function SubCategoriesEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name.en" />
        <TextInput source="name.de" lable="Name in German" />
        <ReferenceInput
          label="Category"
          source="category"
          reference="categories"
        >
          <SelectInput optionText="name.en" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
}
