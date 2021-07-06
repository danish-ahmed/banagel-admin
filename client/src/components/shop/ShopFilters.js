import React from "react";
import { Input } from "@material-ui/core";
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
  const [segments, setSegments] = React.useState([]);
  const locale = useLocale();
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getData() {
      const response = await fetch(API_URL + "/segments", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let result = await response.json();
      setSegments(result);
    }
    getData();
  }, []);
  return (
    <FilterList label="Segment" icon={<LocalOfferIcon />}>
      {segments.map((segment) => (
        <FilterListItem
          label={segment.name[locale]}
          key={segment._id}
          value={{ "segment._id": segment._id }}
        />
      ))}
    </FilterList>
  );
};
const ShopName = (props) => {
  const locale = useLocale();
  return (
    <Filter {...props}>
      <TextInput label="Shop Name" source="name" alwaysOn />
    </Filter>
  );
};
const ShopFilters = () => {
  return (
    <Card>
      <CardContent>
        <Segment />
        <ShopName />
      </CardContent>
    </Card>
  );
};

export default ShopFilters;
