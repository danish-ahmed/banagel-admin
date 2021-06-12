import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";
import Categories from "../commons/Categories";

export default function SubCategoriesEdit(props) {
  console.log(props);
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" />
        <Categories />
      </SimpleForm>
    </Edit>
  );
}
