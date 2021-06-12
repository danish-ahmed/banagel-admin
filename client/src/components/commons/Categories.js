import { SelectInput } from "ra-ui-materialui";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  useEffect(async () => {
    const response = await fetch(API_URL + "/categories", {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
      }),
    });
    let result = await response.json();

    setCategories(result);
  }, []);
  return (
    <SelectInput
      optionText="name"
      source="category"
      optionValue="id"
      choices={categories}
    />
  );
}
