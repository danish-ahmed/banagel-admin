import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import Segments from "../commons/Segments";

export default function CategoriesCreate(props) {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" label="Name in English" />
        <TextInput source="name_de" label="Name in German" />
        <Segments />
      </SimpleForm>
    </Create>
  );
}
