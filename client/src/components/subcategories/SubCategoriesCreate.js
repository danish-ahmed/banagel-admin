import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";
import Categories from "../commons/Categories";

export default function SubCategoriesCreate(props) {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" />
        <Categories />
      </SimpleForm>
    </Create>
  );
}
