// in src/Menu.js
import * as React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { DashboardMenuItem, MenuItemLink, getResources } from "react-admin";
import DefaultIcon from "@material-ui/icons/ViewList";
import LabelIcon from "@material-ui/icons/Label";
import BookIcon from "@material-ui/icons/Book";
import CategoryIcon from "@material-ui/icons/Category";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import ShopIcon from "@material-ui/icons/Shop";
import StoreIcon from "@material-ui/icons/Store";

const MyMenu = ({ onMenuClick, logout }) => {
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const resources = useSelector(getResources);
  return (
    <div>
      <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
      <MenuItemLink to="/shops" primaryText="Shops" leftIcon={<ShopIcon />} />
      <MenuItemLink
        to="/segments"
        primaryText="Segments"
        leftIcon={<CategoryIcon />}
      />
      <MenuItemLink
        to="/categories"
        primaryText="Categories"
        leftIcon={<CategoryIcon />}
      />
      <MenuItemLink
        to="/subcategories"
        primaryText="Sub categories"
        leftIcon={<AccountTreeIcon />}
      />
      <MenuItemLink
        to="/products"
        primaryText="Products"
        leftIcon={<CardGiftcardIcon />}
      />
      <MenuItemLink
        to="/shop-products"
        primaryText="Shop Products"
        leftIcon={<StoreIcon />}
      />
      <MenuItemLink
        to="/orders"
        primaryText="Orders"
        leftIcon={<StoreIcon />}
      />
      <MenuItemLink
        to="/users"
        primaryText="Profile"
        leftIcon={<StoreIcon />}
      />

      {/* <MenuItemLink
        to="/user"
        primaryText="Miscellaneous"
        leftIcon={<LabelIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      /> */}
      {isXSmall && logout}
    </div>
  );
};

export default MyMenu;
