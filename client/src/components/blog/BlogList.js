import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";

const BlogList = (props) => {
  const locale = useLocale();
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source={`title`} label="Blog Title" />
        <TextField source={`segment.name.${locale}`} label="Segment" />
        {props.permissions === "admin" && (
          <EditButton basePath="/blogs" label="Edit" />
        )}
        {props.permissions === "admin" && (
          <DeleteButton basePath="/blogs" label="Delete" />
        )}
      </Datagrid>
    </List>
  );
};
export default BlogList;
