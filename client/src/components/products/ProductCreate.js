import React from "react";
import { FormControl, InputLabel, Input, MenuItem } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { Grid } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { DropzoneArea } from "material-ui-dropzone";
import { showNotification, useLocale } from "react-admin";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Product.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API_URL } from "../../config";
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

export default function ProductCreate(props) {
  const classes = useStyles();
  const locale = useLocale();
  const [values, setValues] = React.useState({
    name: "",
    name_de: "",
    price: "",
    category: "",
  });
  const [description, setdescription] = React.useState("");

  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getData() {
      const response = await fetch(API_URL + "/subcategories/all", {
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

  const handleChange = (prop) => (event) => {
    setError(null);
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleChangeCategory = (event) => {
    setError(null);
    setValues({ ...values, ["category"]: event.target.value });
  };

  const handleSubmit = (event) => {
    setError(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("name_de", values.name_de);
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("description", description);

    formData.append("file", files[0]);
    setError("");
    fetch(API_URL + "/products", {
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
    <React.Fragment>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Create Product
          </Typography>
          <br />
          {error && (
            <Alert variant="outlined" severity="error">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
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
              </Grid>
              <Grid item xs={6}>
                <FormControl class="cat-control">
                  {/* <TextField
                    id="category"
                    select
                    label="Select Category"
                    value={values.category}
                    onChange={handleChangeCategory}
                    helperText="Please select your category"
                  >
                    {categories.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name[locale]}
                      </MenuItem>
                    ))}
                  </TextField> */}
                  <Autocomplete
                    id="grouped-demo"
                    options={categories}
                    groupBy={(option) => option.category.name[locale]}
                    getOptionLabel={(option) => option.name[locale]}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Category"
                        variant="outlined"
                      />
                    )}
                    // defaultValue={props.initialVal}
                    // value={props.initialVal}
                    onChange={props.handleSelect}
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
                Create Product
              </Button>
            </FormControl>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
