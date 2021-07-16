import React from "react";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  MenuItem,
  FormGroup,
  Grid,
  Switch,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import decodeJwt from "jwt-decode";
import ReactQuill from "react-quill";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { DropzoneArea } from "material-ui-dropzone";
import MuiPhoneInput from "material-ui-phone-number";
import { showNotification, useLocale } from "react-admin";
import OfferModel from "./OfferModel";
import { API_URL } from "../../config";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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

export default function OfferCreate(props) {
  const locale = useLocale();
  const classes = useStyles();
  const [values, setValues] = React.useState({
    offerName: "",
    isVisibleOnShopsPage: true,
    owner: decodeJwt(localStorage.getItem("token"))._id,
  });
  const [products, setProduct] = React.useState([]);
  const [files, setFiles] = React.useState();
  const [error, setError] = React.useState("");
  const [description, setdescription] = React.useState();

  const handleSubmit = (event) => {
    const formData = new FormData();
    formData.append("offerName", values.offerName);
    formData.append("description", description);
    formData.append("isVisibleOnShopsPage", values.isVisibleOnShopsPage);
    formData.append("file", files[0]);
    formData.append("products", JSON.stringify(products));
    fetch(API_URL + "/offers", {
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
  };
  const handleAddProduct = (data) => {
    setProduct([...products, data]);
  };
  const handleDelete = (data) => {
    setProduct((products) => products.filter((item) => item._id !== data._id));
  };
  const handleChange = (prop) => (event) => {
    if (prop === "isVisibleOnShopsPage") {
      setValues({
        ...values,
        [prop]: event.target.checked,
      });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Create Offer
        </Typography>
        <br />
        {error && (
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        )}
        <OfferModel addProduct={handleAddProduct} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="offerName"
                label="Offer Name"
                type="text"
                value={values.offerName}
                onChange={handleChange("offerName")}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                style={{ marginTop: "30px" }}
                control={
                  <Switch
                    size="small"
                    color="primary"
                    checked={values.isVisibleOnShopsPage}
                    onChange={handleChange("isVisibleOnShopsPage")}
                  />
                }
                label="Is Product Visible on Shops Page"
              />
            </Grid>

            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name </TableCell>
                    <TableCell align="right">VAT %</TableCell>
                    <TableCell align="right">Actual Price</TableCell>
                    <TableCell align="right">Has Discount</TableCell>
                    <TableCell align="right">Discount %</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 &&
                    products.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell component="th" scope="row">
                          {row.name.en}
                        </TableCell>
                        <TableCell align="right">{row.VAT}</TableCell>
                        <TableCell align="right">{row.actualPrice}</TableCell>
                        <TableCell align="right">
                          {row.hasDiscount ? "Yes" : "No"}
                        </TableCell>
                        <TableCell align="right">
                          {row.hasDiscount ? row.discount : ""}
                        </TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDelete(row)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
              <p>Offer Image</p>
              <DropzoneArea
                acceptedFiles={["image/*"]}
                filesLimit="1"
                dropzoneText={"Drag and drop an image here or click"}
                onChange={(files) => setFiles(files)}
                name="filename"
              />
            </FormControl>
            <FormControl>
              <Button
                type="submit"
                id="btn-submit"
                variant="contained"
                color="primary"
              >
                Add Offer
              </Button>
            </FormControl>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}
