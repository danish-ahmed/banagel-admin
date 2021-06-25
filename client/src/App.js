import React, { useState, useEffect } from "react";
import "./App.css";
import { Admin, Resource } from "react-admin";
import MyLayout from "./components/layouts/MyLayout";
import authProvider from "./authProvider";

import Dashboard from "./components/dashboard/Dashboard";
import LoginPage from "./components/auth/LoginPage";
import ShopList from "./components/shop/ShopList";
import ShopShow from "./components/shop/ShopShow";
import ShopEdit from "./components/shop/ShopEdit";
import ShopCreate from "./components/shop/ShopCreate";
import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";
import CategoriesList from "./components/categories/CategoriesList";
import CategoriesEdit from "./components/categories/CategoriesEdit";
import SubCategoriesList from "./components/subcategories/SubCategoriesList";
import SubCategoriesEdit from "./components/subcategories/SubCategoriesEdit";
import SubCategoriesCreate from "./components/subcategories/SubCategoriesCreate";
import ProductCreate from "./components/products/ProductCreate";
import ProductList from "./components/products/ProductList";
import ProductEdit from "./components/products/ProductEdit";
import i18nProvider from "./polyglotProvider";
import ShopProductCreate from "./components/shopProducts/ShopProductCreate";
import ShopProductList from "./components/shopProducts/ShopProductList";
import CategoriesCreate from "./components/categories/CategoriesCreate";
import { API_URL } from "./config";
import MyDataProvider from "./MyDataProvider";
import ShopProductEdit from "./components/shopProducts/ShopProductEdit";
import SegmentList from "./components/segments/SegmentList";
import SegmentCreate from "./components/segments/SegmentCreate";
import SegmentEdit from "./components/segments/SegmentEdit";
function App() {
  const [permission, setPermissions] = useState("");

  useEffect(() => {
    authProvider
      .getPermissions()
      .then((permission) => setPermissions(permission));
  }, "none");
  return (
    <Admin
      dashboard={Dashboard}
      loginPage={LoginPage}
      authProvider={authProvider}
      dataProvider={MyDataProvider}
      layout={MyLayout}
      i18nProvider={i18nProvider}
      // locale="en"
    >
      <Resource
        name="shops"
        label="Shop"
        show={ShopShow}
        list={ShopList}
        edit={permission == "edit" ? ShopEdit : null}
        create={permission === "admin" ? ShopCreate : null}
      />
      <Resource
        name="segments"
        label="Segments"
        permission={authProvider.getPermissions()}
        list={SegmentList}
        edit={permission === "admin" ? SegmentEdit : null}
        create={permission === "admin" ? SegmentCreate : null}
      />
      <Resource
        name="categories"
        label="Categoies"
        permission={authProvider.getPermissions()}
        list={CategoriesList}
        edit={permission === "admin" ? CategoriesEdit : null}
        create={permission === "admin" ? CategoriesCreate : null}
      />
      <Resource
        name="subcategories"
        label="Sub Categoies"
        permission={authProvider.getPermissions()}
        list={SubCategoriesList}
        create={permission === "admin" ? SubCategoriesCreate : null}
        edit={permission === "admin" ? SubCategoriesEdit : null}
      />

      <Resource
        name="products"
        label="Products"
        permission={authProvider.getPermissions()}
        list={ProductList}
        create={permission === "admin" ? ProductCreate : null}
        edit={permission === "admin" ? ProductEdit : null}
      />

      <Resource
        name="shop-products"
        label="ShopProducts"
        list={ShopProductList}
        permission={authProvider.getPermissions()}
        create={permission === "member" ? ShopProductCreate : null}
        edit={permission === "member" ? ShopProductEdit : null}
      />
    </Admin>
  );
}

export default App;
