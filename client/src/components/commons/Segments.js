import { SelectInput } from "ra-ui-materialui";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { useLocale } from "react-admin";

export default function Segments(props) {
  const locale = useLocale();
  const [segments, setSegments] = useState([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch(API_URL + "/segments", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      setSegments(await response.json());
    }
    getData();
  }, []);
  return (
    <SelectInput
      optionText={`name['${locale}']`}
      source="segment"
      optionValue="_id"
      choices={segments}
    />
  );
}
