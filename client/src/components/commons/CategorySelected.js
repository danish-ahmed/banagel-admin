import { SelectInput } from "ra-ui-materialui";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { useLocale } from "react-admin";
import TextField from "@material-ui/core/TextField";
import { MenuItem } from "@material-ui/core";

export default function CategorySelected(props) {
  //   const locale = useLocale();
  const [categories, setCategories] = useState([]);
  //   const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch(API_URL + "/categories", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      setCategories(await response.json());
    }
    getData();
  }, []);
  return (
    <TextField
      id="standard-select-category"
      select
      label="Select"
      value={props.record.category._id}
      onChange={props.handleChangeCategory}
      helperText="Please select your Category"
    >
      {categories.map((option) => (
        <MenuItem
          key={option.id}
          value={option.id}
          selected={option.id === props.record.category._id}
        >
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
