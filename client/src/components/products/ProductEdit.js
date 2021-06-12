import React from "react";
import { FormControl, InputLabel, Input, MenuItem } from "@material-ui/core";
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
import "./Product.css";

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

export default function ProductEdit(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: "",
    price: "",
    category: "",
  });
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");
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
        filename: product.filename,
      });
      setdescription(product.description);
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
          Edit Product
        </Typography>
        <br />
        {error && (
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
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
            <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
            <Input
              id="price"
              name="price"
              value={values.price}
              type="number"
              onChange={handleChange("price")}
            />
          </FormControl>
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
              Create Product
            </Button>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
}
