/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API_URL } from "../../config";
import { useLocale } from "react-admin";
export default function ProductSelect2(props) {
  const locale = useLocale();
  const [products, setProducts] = React.useState([]);
  const [initialVal, setInitialVal] = React.useState();
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getData() {
      const response = await fetch(API_URL + "/products", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let result = await response.json();
      setProducts(result);
    }
    getData();
    async function getShopProducts() {
      const product_response = await fetch(
        API_URL + "/shop-products/" + props.id,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      let shopproduct = await product_response.json();
      if (shopproduct) {
      }
    }
    getShopProducts();
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

  return (
    <Autocomplete
      id="grouped-demo"
      options={products}
      groupBy={(option) => option.category.name[locale]}
      getOptionLabel={(option) => option.name[locale]}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Select Product" variant="outlined" />
      )}
      defaultValue={initialVal}
      value={initialVal}
      onChange={props.handleSelect}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
