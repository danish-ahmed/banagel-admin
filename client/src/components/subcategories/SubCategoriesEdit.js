import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  // ReferenceInput,
  // SelectInput,
} from "react-admin";
import Categories from "../commons/Categories";

export default function SubCategoriesEdit(props) {
  console.log(props);
  return (
    <Edit {...props}>
      <SimpleForm resource>
        <TextInput source="name.en" />
        <TextInput source="name.de" lable="Name in German" />
        <Categories source="categories.name.en" />
      </SimpleForm>
    </Edit>
  );
}
