import React from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  Input,
  MenuItem,
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
import { useLocale, showNotification } from "react-admin";
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

export default function ShopEdit(props) {
  showNotification("Shop saved Successfully");
  const locale = useLocale();
  const classes = useStyles();
  const [values, setValues] = React.useState({
    shopname: "",
    shopname_de: "",
    address: "",
    commercialID: "",
    phone: "",
    owner: "",
    category: "",
  });
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");

  const [categories, setCategories] = React.useState([]);
  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });
    async function getCategories() {
      const response = await fetch(API_URL + "/segments", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let result = await response.json();
      setCategories(result);
    }
    getCategories();
    async function getShop() {
      const shop_response = await fetch(API_URL + "/shops/" + props.id, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
        }),
      });
      let shop = await shop_response.json();
      if (shop) {
        setValues({
          shopname: shop.shopname.en,
          shopname_de: shop.shopname.de,
          address: shop.address,
          category: shop.segment._id,
          owner: shop.owner._id,
          commercialID: shop.commercialID,
          filename: shop.filename,
          phone: shop.phone,
        });
      } else {
        // ---------------
        // DONOT SHOW FORM
        // ---------------
      }
    }
    getShop();
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
    formData.append("shopname_de", values.shopname_de);
    formData.append("address", values.address);
    formData.append("commercialID", values.commercialID);
    formData.append("owner", decodeJwt(localStorage.getItem("token"))._id);
    formData.append("phone", values.phone);
    formData.append("segment", values.category);
    formData.append("file", files[0]);
    setError("");
    fetch(API_URL + "/shops/" + props.id, {
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
          Edit Shop
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
            <InputLabel htmlFor="address">Commercial ID</InputLabel>
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
              helperText="Enter Phone"
              name="phone"
              value={values.phone}
              onChange={handleChangePhone}
            />
          </FormControl>
          <FormControl className={classes.margin}>
            <TextField
              id="category"
              select
              label="Select"
              value={values.category}
              onChange={handleChangeCategory}
              helperText="Please select your currency"
            >
              {categories.map((option) => (
                <MenuItem
                  key={option._id}
                  value={option._id}
                  selected={option._id === values.category}
                >
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
              Edit Shop
            </Button>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
}
