import React from "react";
import { FormControl, FormGroup } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { Alert } from "@material-ui/lab";
import "react-quill/dist/quill.snow.css";
import { showNotification } from "react-admin";
import { API_URL } from "../../config";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import "../products/Product.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
}));

export default function ShopProductAdminEdit(props) {
  const classes = useStyles();
  const [error, setError] = React.useState("");
  const [values, setValues] = React.useState({
    isProductOfMonth: false,
  });
  React.useEffect(() => {
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
        setValues({
          ...values,
          ["isProductOfMonth"]: shopproduct.isProductOfMonth,
        });
      } else {
      }
    }
    getShopProducts();
  }, []);

  //   const handleDiscountToggle = (event) => {
  //     setValues({ ...values, ["isProductOfMonth"]: !values.isProductOfMonth });
  //   };
  const handleChange = (prop) => (event) => {
    setError(null);
    if (prop === "isProductOfMonth") {
      setValues({ ...values, ["isProductOfMonth"]: event.target.checked });
    } else {
      setValues({ ...values, [prop]: event.target.checked });
    }
  };

  const handleSubmit = (event) => {
    setError(null);
    const formData = new FormData();
    formData.append("isProductOfMonth", values.isProductOfMonth);
    setError("");
    fetch(API_URL + `/shop-products/set-product-of-month/${props.id}`, {
      method: "PUT",
      mimeType: "multipart/form-data",
      contentType: false,
      body: formData,
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.ok) {
          showNotification("Shop saved Successfully");

          setTimeout(function () {
            props.history.push({
              pathname: "/shop-products",
            });
          }, 500);

          // alert("Perfect! ");
        } else if (!res.ok) {
          throw res;
        }
      })
      .catch((err) => {
        err.text().then((errorMessage) => {
          setError(errorMessage);
        });
      });
    event.preventDefault();
  };
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Edit Shop Product
        </Typography>
        <br />
        {error && (
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        )}
        <form id="product-from" onSubmit={handleSubmit}>
          <div>
            <FormGroup class="custom-control" className={classes.margin}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    color="primary"
                    checked={values.isProductOfMonth}
                    onChange={handleChange("isProductOfMonth")}
                  />
                }
                label="Set is Product of Month"
              />
            </FormGroup>
            <FormControl>
              <Button
                type="submit"
                id="btn-submit"
                variant="contained"
                color="primary"
              >
                Edit Product
              </Button>
            </FormControl>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
