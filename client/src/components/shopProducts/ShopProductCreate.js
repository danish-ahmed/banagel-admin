import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  MenuItem,
  FormGroup,
  Grid,
} from "@material-ui/core";
import decodeJwt from "jwt-decode";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { DropzoneArea } from "material-ui-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { showNotification, useLocale } from "react-admin";
import { API_URL } from "../../config";
import Tags from "../commons/Tags";
import TagsCreate from "../commons/TagsCreate";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";

import ProductSelect from "../commons/ProductSelect";
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

export default function ShopProductCreate(props) {
  const classes = useStyles();
  const locale = useLocale();
  const [values, setValues] = React.useState({
    name: "",
    name_de: "",
    shop: "",
    price: 0,
    unit: "",
    stock: 0,
    category: "",
    discount: 0,
    VAT: 0,
    selectedTags: [],
  });
  const [tags, setTags] = React.useState([]);
  const [tag, setTag] = React.useState("");

  const [selectedProduct, setSelectedProduct] = React.useState();
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");
  const [hasDiscount, setHasDiscount] = React.useState(false);
  const [discount, setDiscount] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [description, setdescription] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({});
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getSubcategories() {
      const response = await fetch(API_URL + "/subcategories/all", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let result = await response.json();
      setCategories(result);
    }
    getSubcategories();

    async function getProducts() {
      const product_response = await fetch(API_URL + "/products/" + props.id, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let product = await product_response.json();
      if (product) {
        setValues({
          ...values,
          ["name"]: product.name,
          ["price"]: product.price,
          ["category"]: product.category._id,
        });
        setdescription(product.description);
        const file = new File([product.image], "image");
        setFiles(file);
      } else {
        // ---------------
        // DONOT SHOW FORM
        // ---------------
      }
    }
    async function getShop() {
      const response = await fetch(
        API_URL +
          "/users/user-shop/" +
          decodeJwt(localStorage.getItem("token"))._id,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
            "x-auth-token": localStorage.getItem("token"),
          }),
        }
      );
      let shop = await response.json();
      setValues({ ...values, ["shop"]: shop._id });
    }
    getShop();
    async function getTags() {
      const response = await fetch(API_URL + "/tags", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let result = await response.json();
      setTags(result);
    }
    getTags();
  }, []);

  const handleChange = (prop) => (event) => {
    setError(null);
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleChangeCategory = (event) => {
    setValues({ ...values, ["category"]: event.target.value });
  };
  const handleDiscountToggle = () => {
    setHasDiscount((prev) => !prev);
  };
  async function getProduct(newValue) {
    if (newValue) {
      const product_response = await fetch(
        API_URL + "/products/" + newValue._id,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      let product = await product_response.json();
      if (product) {
        setValues({
          ...values,
          ["name"]: product.name.en,
          ["name_de"]: product.name.de,
          ["price"]: product.price,
          ["category"]: product.category._id,
        });
        setdescription(product.description);
        const file = new File([product.image], "image");
        setFiles(file);
      } else {
        // ---------------
        // DONOT SHOW FORM
        // ---------------
      }
    } else {
    }
  }
  const handleProductSelect = async (event, newValue) => {
    getProduct(newValue);
    setSelectedProduct(newValue._id);
  };
  const handleTagSelect = async (event, newValue) => {
    console.log(JSON.stringify(newValue, null, " "));
    setValues({
      ...values,
      ["selectedTags"]: JSON.stringify(newValue, null, " "),
    });
  };
  const tagsHandleSubmit = () => {
    if (tag) {
      const data = { name: tag };

      fetch(API_URL + "/tags", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            setError("Something Went wrong");
          }
        })
        .then((data) => {
          setTags([...tags, data]);
          setOpen(false);
        });
    }
  };
  const handleSubmit = (event) => {
    setError(null);

    const formData = new FormData();
    formData.append("shop", values.shop);
    formData.append("product", selectedProduct);
    formData.append("name", values.name);
    formData.append("name_de", values.name_de);
    formData.append("price", values.price);
    formData.append("unit", values.unit);
    formData.append("stock", values.stock);
    formData.append("VAT", values.VAT);
    // formData.append("category", values.category);
    formData.append("tags", values.selectedTags);
    formData.append("description", description);
    formData.append("hasDiscount", hasDiscount);
    formData.append("discount", values.discount);
    formData.append("file", files[0]);
    hasDiscount && formData.append("discount_start_date", dateRange.startDate);
    hasDiscount && formData.append("discount_end_date", dateRange.endDate);

    setError("");
    fetch(API_URL + `/shop-products`, {
      method: "POST",
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
          Add Product to shop
        </Typography>
        <br />
        {error && (
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        )}
        <form id="product-from" onSubmit={handleSubmit}>
          <FormControl fullWidth className={classes.margin}>
            <ProductSelect handleSelect={handleProductSelect} />
          </FormControl>
          {selectedProduct && (
            <div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="name">Product Name</InputLabel>
                    <Input
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange("name")}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="name_de">
                      Product Name in German
                    </InputLabel>
                    <Input
                      id="name_de"
                      name="name_de"
                      value={values.name_de}
                      onChange={handleChange("name_de")}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="price">Price</InputLabel>
                    <Input
                      id="price"
                      name="price"
                      value={values.price}
                      type="number"
                      onChange={handleChange("price")}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="VAT">VAT %</InputLabel>
                    <Input
                      id="VAT"
                      name="vat"
                      value={values.VAT}
                      type="number"
                      onChange={handleChange("VAT")}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="unit">Unit</InputLabel>
                    <Input
                      id="unit"
                      name="unit"
                      value={values.unit}
                      type="text"
                      onChange={handleChange("unit")}
                      placeholder="Unit eg: 1.5 kg OR 1 Piece"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel htmlFor="stock">Stock</InputLabel>
                    <Input
                      id="stock"
                      name="stock"
                      value={values.stock}
                      type="number"
                      onChange={handleChange("stock")}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <FormGroup class="custom-control" className={classes.margin}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      color="primary"
                      checked={hasDiscount}
                      onChange={handleDiscountToggle}
                    />
                  }
                  label="Has Product Discount"
                />
              </FormGroup>
              {hasDiscount && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth className={classes.margin}>
                      <InputLabel htmlFor="discount">
                        Discount Percentage
                      </InputLabel>
                      <Input
                        type="number"
                        id="discount"
                        name="discount"
                        value={values.discount}
                        onChange={handleChange("discount")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth className={classes.margin}>
                      <InputLabel htmlFor="start-date">
                        Discount Date Range
                      </InputLabel>
                      <Input
                        type="text"
                        id="start-date"
                        name="discount_start_date"
                        onClick={() => setOpen(!open)}
                        value={
                          dateRange &&
                          dateRange.startDate &&
                          `${
                            dateRange.startDate.getDate() +
                            "/" +
                            dateRange.startDate.getMonth() +
                            "/" +
                            dateRange.startDate.getFullYear()
                          } - ${
                            dateRange.endDate.getDate() +
                            "/" +
                            dateRange.endDate.getMonth() +
                            "/" +
                            dateRange.endDate.getFullYear()
                          }`
                        }
                      />
                      <DateRangePicker
                        open={open}
                        toggle={() => setOpen(!open)}
                        onChange={(range) => setDateRange(range)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl className={classes.margin}>
                    <TagsCreate
                      handleSubmit={tagsHandleSubmit}
                      tags={tags}
                      setTags={setTags}
                      tag={tag}
                      setTag={setTag}
                      handleTagSelect={handleTagSelect}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl fullWidth>
                <label class="desc-label" htmlFor="description">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  name="description"
                  onChange={setdescription}
                  id="description"
                />
              </FormControl>
              <FormControl fullWidth>
                <label className="img-label" htmlFor="image">
                  Upload image
                </label>
                <DropzoneArea
                  id="image"
                  acceptedFiles={["image/*"]}
                  filesLimit="1"
                  dropzoneText={"Drag and drop an image here or click"}
                  onChange={(files) => setFiles(files)}
                  name="image"
                />
              </FormControl>
              <FormControl>
                <Button
                  type="submit"
                  id="btn-submit"
                  variant="contained"
                  color="primary"
                >
                  Add Product
                </Button>
              </FormControl>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
