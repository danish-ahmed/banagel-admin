import React from "react";
import { FilterList, FilterListItem, Filter, TextInput } from "react-admin";
import LocalOfferIcon from "@material-ui/icons/LocalOfferOutlined";
import { API_URL } from "../../config";
import { Card as MuiCard, CardContent, withStyles } from "@material-ui/core";

import { useLocale } from "react-admin";
const Card = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      order: -1, // display on the left rather than on the right of the list
      width: "15em",
      marginRight: "1em",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}))(MuiCard);

const Segment = () => {
  const [categories, setCategories] = React.useState([]);
  const locale = useLocale();
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getData() {
      const response = await fetch(API_URL + "/subcategories", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let result = await response.json();
      setCategories(result);
    }
    getData();
  }, []);
  return (
    <FilterList label="Segment" icon={<LocalOfferIcon />}>
      {categories.map((category) => (
        <FilterListItem
          label={category.name[locale]}
          key={category._id}
          value={{ "category._id": category._id }}
        />
      ))}
    </FilterList>
  );
};
const ShopName = (props) => {
  const locale = useLocale();
  return (
    <Filter {...props}>
      <TextInput label="Product Name" source="name" alwaysOn />
    </Filter>
  );
};
const ProductFilters = () => {
  return (
    <Card>
      <CardContent>
        <Segment />
        <ShopName />
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
