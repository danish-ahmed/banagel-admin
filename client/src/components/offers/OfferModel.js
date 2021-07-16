import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ShopProductSelect from "../commons/ShopProductSelect";
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

export default function OfferModel(props) {
  const [open, setOpen] = React.useState(false);
  const [hasDiscount, setHasDiscount] = React.useState(false);
  const [offerProduct, setOfferProduct] = React.useState({});
  const [error, setError] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleProductSelect = async (event, newValue) => {
    // getProduct(newValue);
    // console.log(newValue);
    setOfferProduct({
      ...newValue,
    });
  };

  const handleChange = (prop) => (event) => {
    setError(null);
    if (prop === "hasDiscount") {
      setOfferProduct({
        ...offerProduct,
        [prop]: event.target.checked,
      });
    } else if (prop === "discount") {
      setOfferProduct({
        ...offerProduct,
        [prop]: event.target.value,
        ["price"]: (
          offerProduct.actualPrice -
          (event.target.value / 100) * offerProduct.actualPrice
        ).toFixed(2),
      });
    } else {
      setOfferProduct({ ...offerProduct, [prop]: event.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    props.addProduct(offerProduct);
    setOfferProduct({});
    setOpen(false);
    // setOfferProduct({});
  };
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Product
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <form onSubmit={handleSubmit}>
            <ShopProductSelect handleSelect={handleProductSelect} />
            {Object.keys(offerProduct).length > 0 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Product Name"
                      type="text"
                      disabled={true}
                      value={offerProduct.name.en}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      autoFocus
                      name="VAT"
                      margin="dense"
                      id="VAT"
                      label="VAT %"
                      type="number"
                      value={offerProduct.VAT}
                      fullWidth
                      onChange={handleChange("VAT")}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="actualPrice"
                      label="Actual Price"
                      type="number"
                      value={offerProduct.actualPrice}
                      fullWidth
                      onChange={handleChange("actualPrice")}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      style={{ marginTop: "30px" }}
                      control={
                        <Switch
                          size="small"
                          color="primary"
                          checked={offerProduct.hasDiscount}
                          onChange={handleChange("hasDiscount")}
                        />
                      }
                      label="Has Product Discount"
                    />
                  </Grid>
                </Grid>
                {offerProduct.hasDiscount && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="discountPercent"
                        label="Discount %"
                        type="number"
                        value={offerProduct.discount}
                        onChange={handleChange("discount")}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        disabled={true}
                        id="discountPercent"
                        label="Price"
                        type="number"
                        value={offerProduct.price}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                )}
              </>
            )}

            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
