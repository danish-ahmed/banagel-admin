import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API_URL } from "../../config";

export default function TagsCreate(props) {
  const [open, setOpen] = React.useState(false);

  const [error, setError] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Autocomplete
        multiple
        id="tags-standard"
        options={props.tags}
        getOptionLabel={(option) => option.name.en}
        // defaultValue={[top100Films[13]]}
        onChange={props.handleTagSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select Tags"
            placeholder="Tags"
          />
        )}
      />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create Tag
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tag"
            type="text"
            fullWidth
            value={props.tag}
            onChange={(e) => props.setTag(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={props.handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
