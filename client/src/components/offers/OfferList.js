import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useLocale,
} from "react-admin";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const ProductsPanel = ({ id, record, resource }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>VAT</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {record.products.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell>{row.name.en}</TableCell>
              <TableCell>{row.VAT}</TableCell>
              <TableCell>{row.actualPrice.toFixed(2)}</TableCell>
              <TableCell>{row.discount}</TableCell>
              <TableCell>{row.price.toFixed(2)}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <b>{record.totalPrice.toFixed(2)}</b>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
const OfferList = (props) => {
  const locale = useLocale();
  return (
    <List {...props}>
      <Datagrid expand={<ProductsPanel />}>
        <TextField source="id" />
        <TextField source="name" label="Offer Name" onClick={() => alert()} />
        <TextField source="description" label="Description" />
        <EditButton basePath="/offers" label="Edit" />
        <DeleteButton basePath="/offers" label="Delete" />
      </Datagrid>
    </List>
  );
};
export default OfferList;
