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

export default function OfferEditAdmin(props) {
  const locale = useLocale();
  const classes = useStyles();
  const [values, setValues] = React.useState({
    offerName: "",
    isVisibleOnSegmentsPage: true,
    isVisibleOnMainPage: true,
    owner: decodeJwt(localStorage.getItem("token"))._id,
  });
  const [error, setError] = React.useState("");
  const handleSubmit = (event) => {
    const formData = new FormData();
    formData.append("offerName", values.offerName);
    formData.append("isVisibleOnSegmentsPage", values.isVisibleOnSegmentsPage);
    formData.append("isVisibleOnMainPage", values.isVisibleOnMainPage);
    fetch(API_URL + "/offers/update/" + props.id, {
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
              pathname: "/offers",
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

  const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.checked,
    });
  };

  React.useEffect(() => {
    // setValues({ ...values, ["owner"]: localStorage.getItem("user").id });

    async function getOffer() {
      const product_response = await fetch(API_URL + "/offers/" + props.id, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          "x-auth-token": localStorage.getItem("token"),
        }),
      });
      let offer = await product_response.json();
      if (offer) {
        setValues({
          ...values,
          ["isVisibleOnSegmentsPage"]: offer.isVisibleOnSegmentsPage,
          ["isVisibleOnMainPage"]: offer.isVisibleOnMainPage,
        });
      } else {
        // ---------------
        // DONOT SHOW FORM
        // ---------------
      }
    }
    getOffer();
  }, [props.id]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Edit Offer
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
              <FormControlLabel
                style={{ marginTop: "30px" }}
                control={
                  <Switch
                    size="small"
                    color="primary"
                    checked={values.isVisibleOnMainPage}
                    onChange={handleChange("isVisibleOnMainPage")}
                  />
                }
                label="Is Product Visible on Main Page"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                style={{ marginTop: "30px" }}
                control={
                  <Switch
                    size="small"
                    color="primary"
                    checked={values.isVisibleOnSegmentsPage}
                    onChange={handleChange("isVisibleOnSegmentsPage")}
                  />
                }
                label="Is Product Visible on Segment Page"
              />
            </Grid>
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
