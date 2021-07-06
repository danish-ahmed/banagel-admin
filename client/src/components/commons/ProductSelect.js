/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API_URL } from "../../config";
import { useLocale } from "react-admin";
export default function ProductSelect(props) {
  const locale = useLocale();
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getData() {
      const response = await fetch(API_URL + "/products/shop", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          "x-auth-token": localStorage.getItem("token"),
        }),
      });
      let result = await response.json();
      setProducts(result);
    }
    getData();
  }, []);
  //
  // const options = products.map((option) => {
  //   const firstLetter = option.name[0].toUpperCase();
  //   return {
  //     firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
  //     ...option,
  //   };
  // });
  //

  return props.initialVal ? (
    <Autocomplete
      id="grouped-demo"
      options={products}
      groupBy={(option) => option.category.name[locale]}
      getOptionLabel={(option) => option.name[locale]}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Select Product" variant="outlined" />
      )}
      defaultValue={props.initialVal}
      value={props.initialVal}
      onChange={props.handleSelect}
    />
  ) : (
    <Autocomplete
      id="grouped-demo"
      options={products}
      groupBy={(option) => option.category.name[locale]}
      getOptionLabel={(option) => option.name[locale]}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Select Product" variant="outlined" />
      )}
      onChange={props.handleSelect}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
