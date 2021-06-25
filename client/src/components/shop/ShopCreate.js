import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  MenuItem,
  Grid,
} from "@material-ui/core";
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
import { showNotification, useLocale } from "react-admin";
import { API_URL } from "../../config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
}));

export default function ShopCreate(props) {
  const locale = useLocale();
  showNotification("Shop saved Successfully");
  const classes = useStyles();
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    shopname: "",
    shopname_de: "",
    address: "",
    commercialID: "",
    phone: "",
    owner: decodeJwt(localStorage.getItem("token"))._id,
    category: "",
  });
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");

  const [categories, setCategories] = React.useState([]);
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
      setCategories(result);
    }
    getData();
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
    const data = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
      phone: values.phone,
    };

    setError("");
    fetch(API_URL + "/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
          // alert("Perfect! ");
        } else if (!res.ok) {
          throw res;
        }
        res.json();
      })
      .then((data) => {
        // POST SHOP
        const formData = new FormData();
        formData.append("shopname", values.shopname);
        formData.append("shopname_de", values.shopname_de);
        formData.append("address", values.address);
        formData.append("commercialID", values.commercialID);
        formData.append("owner", data._id);
        formData.append("phone", values.phone);
        formData.append("segment", values.category);
        formData.append("file", files[0]);
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-amount">
                  First Name
                </InputLabel>
                <Input
                  id="firstname"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange("firstname")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-amount">
                  Last Name
                </InputLabel>
                <Input
                  id="lastname"
                  name="lastname"
                  value={values.lastname}
                  onChange={handleChange("lastname")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-amount">
                  Email
                </InputLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange("email")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-amount">
                  Password
                </InputLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange("password")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="shopname">Shop Name</InputLabel>
                <Input
                  id="shopname"
                  name="shopname"
                  value={values.shopname}
                  onChange={handleChange("shopname")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="shopname_de">
                  Shop Name in German
                </InputLabel>
                <Input
                  id="shopname_de"
                  name="shopname_de"
                  value={values.shopname_de}
                  onChange={handleChange("shopname_de")}
                />
              </FormControl>
            </Grid>
          </Grid>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="address">Address</InputLabel>
            <Input
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange("address")}
            />
          </FormControl>

          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="commercialID">Commercial ID</InputLabel>
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
          <FormControl className={classes.margin}>
            <TextField
              id="category"
              select
              label="Select Segment"
              value={values.category}
              onChange={handleChangeCategory}
              helperText="Please select your Segment"
            >
              {categories.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name[locale]}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
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
