import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  DateField,
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
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Comment</TableCell>
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
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.quantity * row.price}</TableCell>
              <TableCell>{row.comment}</TableCell>
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
            <TableCell>
              <b>{record.total}</b>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
const CategoriesList = (props) => {
  const locale = useLocale();
  return (
    <List {...props}>
      <Datagrid expand={<ProductsPanel />}>
        <TextField source="id" />
        <TextField source="customer.name" label="Customer Name" />
        <TextField source="customer.phone" label="Phone" />
        <TextField source="customer.address" label="Address" />
        <DateField source="publishDate" label="Created Date" />
      </Datagrid>
    </List>
  );
};
export default CategoriesList;
