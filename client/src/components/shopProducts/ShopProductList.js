import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ImageField,
  DeleteButton,
  BooleanField,
  useLocale,
} from "react-admin";

const ShopProductList = (props) => {
  const locale = useLocale();
  const category = "category.name." + locale;
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source={`shop.shopname.${locale}`} label="Shop Name" />
        <TextField source={`name[${locale}]`} label="Product Name" />
        <TextField source="actualPrice" />
        <BooleanField source="hasDiscount" />
        <TextField source="discount" />
        <TextField source="price" />

        <TextField source="VAT" />
        <ImageField source="image" title={`name[${locale}]`} label="Image" />
        <TextField source={`category.name[${locale}]`} label="Category" />
        <TextField
          source={`category.category.name[${locale}]`}
          label="SubCategory"
        />
        <EditButton basePath="/shop-products" label="Edit" />
        <DeleteButton basePath="/shop-products" label="Delete" />
      </Datagrid>
    </List>
  );
};
export default ShopProductList;
