import { SelectInput } from "ra-ui-materialui";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { useLocale } from "react-admin";

export default function Categories(props) {
  const locale = useLocale();
  const [categories, setCategories] = useState([]);
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
    <SelectInput
      optionText={`name['${locale}']`}
      source="category"
      optionValue="_id"
      choices={categories}
    />
  );
}
