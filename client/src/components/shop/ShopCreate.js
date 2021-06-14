import React from "react";
import { FormControl, InputLabel, Input, MenuItem } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import decodeJwt from "jwt-decode";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { DropzoneArea } from "material-ui-dropzone";
import MuiPhoneInput from "material-ui-phone-number";
import { showNotification } from "react-admin";
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

export default function ShopCreate(props) {
  showNotification("Shop saved Successfully");
  const classes = useStyles();
  const [values, setValues] = React.useState({
    shopname: "",
    address: "",
    commercialID: "",
    phone: "",
    owner: decodeJwt(localStorage.getItem("token"))._id,
    category: "",
  });
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");

  const [categories, setCategories] = React.useState([]);
  React.useEffect(async () => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    const response = await fetch(API_URL + "/categories", {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
      }),
    });
    let result = await response.json();
    setCategories(result);
  }, []);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangePhone = (value) => {
    setValues({ ...values, ["phone"]: value });
  };
  const handleChangeCategory = (event) => {
    setValues({ ...values, ["category"]: event.target.value });
  };
  const handleSubmit = (event) => {
    const formData = new FormData();
    formData.append("shopname", values.shopname);
    formData.append("address", values.address);
    formData.append("commercialID", values.commercialID);
    formData.append("owner", values.owner);
    formData.append("phone", values.phone);
    formData.append("category", values.category);
    formData.append("file", files[0]);
    setError("");
    fetch(API_URL + "/shops", {
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
              pathname: "/shops",
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
          Create Shop
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
              Shop Name
            </InputLabel>
            <Input
              id="shopname"
              name="shopname"
              value={values.shopname}
              onChange={handleChange("shopname")}
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="standard-adornment-amount">Address</InputLabel>
            <Input
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange("address")}
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="standard-adornment-amount">
              Commercial ID
            </InputLabel>
            <Input
              id="commercialID"
              name="commercialID"
              value={values.commercialID}
              onChange={handleChange("commercialID")}
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <MuiPhoneInput
              defaultCountry="de"
              regions={"europe"}
              helperText="Please enter your Phone"
              name="phone"
              value={values.phone}
              onChange={handleChangePhone}
            />
          </FormControl>
          <TextField
            id="standard-select-category"
            select
            label="Select"
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
          <FormControl fullWidth>
            <DropzoneArea
              acceptedFiles={["image/*"]}
              filesLimit="1"
              dropzoneText={"Drag and drop an image here or click"}
              onChange={(files) => setFiles(files)}
              name="filename"
            />
          </FormControl>
          <FormControl>
            <Button type="submit" variant="contained" color="primary">
              Create Shop
            </Button>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
}
