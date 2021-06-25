import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";

const SegmentList = (props) => {
  const locale = useLocale();
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source={`name.${locale}`} label="Name" />
        {props.permissions === "admin" && (
          <EditButton basePath="/segments" label="Edit" />
        )}
        {props.permissions === "admin" && (
          <DeleteButton basePath="/segments" label="Delete" />
        )}
      </Datagrid>
    </List>
  );
};
export default SegmentList;
