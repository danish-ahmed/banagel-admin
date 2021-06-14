import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  MenuItem,
  FormGroup,
  Grid,
} from "@material-ui/core";
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
import { showNotification } from "react-admin";
import { API_URL } from "../../config";
import Tags from "../commons/Tags";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

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
  const [values, setValues] = React.useState({
    name: "",
    price: "",
    category: "",
    discount: 0,
  });
  const [selectedProduct, setSelectedProduct] = React.useState();
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");
  const [hasDiscount, setDiscount] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [description, setdescription] = React.useState();
  React.useEffect(async () => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    const response = await fetch(API_URL + "/subcategories", {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
      }),
    });
    let result = await response.json();
    setCategories(result);

    const product_response = await fetch(API_URL + "/products/" + props.id, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
      }),
    });
    let product = await product_response.json();
    if (product) {
      setValues({
        name: product.name,
        price: product.price,
        category: product.category.id,
      });
      setdescription(product.description);
      const file = new File([product.image], "image");
      setFiles(file);
    } else {
      // ---------------
      // DONOT SHOW FORM
      // ---------------
    }
  }, []);

  const handleChange = (prop) => (event) => {
    setError(null);
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleChangeCategory = (event) => {
    setValues({ ...values, ["category"]: event.target.value });
  };
  const handleDiscountToggle = () => {
    setDiscount((prev) => !prev);
  };
  const handleProductSelect = async (event, newValue) => {
    setSelectedProduct(newValue);
    if (selectedProduct) {
      const product_response = await fetch(
        API_URL + "/products/" + selectedProduct.id,
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
          name: product.name,
          price: product.price,
          category: product.category.id,
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
  };
  const handleSubmit = (event) => {
    setError(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("description", description);

    formData.append("file", files[0]);
    setError("");
    fetch(API_URL + `/products/${props.id}`, {
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
              pathname: "/products",
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
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-amount">
                  Product Name
                </InputLabel>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange("name")}
                />
              </FormControl>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-amount">
                  Price
                </InputLabel>
                <Input
                  id="price"
                  name="price"
                  value={values.price}
                  type="number"
                  onChange={handleChange("price")}
                />
              </FormControl>
              <FormGroup class="custom-control">
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
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.margin}>
                      <InputLabel htmlFor="discount">
                        Discount Percentage
                      </InputLabel>
                      <Input
                        type="number"
                        id="discount"
                        name="discount"
                        value={values.namediscount}
                        onChange={handleChange("discount")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
              )}
              <FormControl class="cat-control">
                <TextField
                  id="standard-select-category"
                  select
                  label="Select Category"
                  value={values.category}
                  onChange={handleChangeCategory}
                  helperText="Please select your category"
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
              <FormControl>
                <Tags />
              </FormControl>
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
