import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import Segments from "../commons/Segments";

export default function BlogEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="title" label="Blog TItle" />
        <Segments />
        <RichTextInput
          source="description"
          label="Description"
          toolbar={[
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction
            ["link", "image"],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
          ]}
        />
      </SimpleForm>
    </Edit>
  );
}
