import { fetchUtils, Admin, Resource, ShowGuesser } from "react-admin";
import restProvider from "ra-data-simple-rest";
import MyLayout from "./components/layouts/MyLayout";
import authProvider from "./authProvider";
import { API_URL } from "./config";

import Dashboard from "./components/dashboard/Dashboard";
import LoginPage from "./components/auth/LoginPage";
import ShopsList from "./components/shop/ShopsList";
import ShopEdit from "./components/shop/ShopEdit";
import CategoriesList from "./components/categories/CategoriesList";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set("x-auth-token", localStorage.getItem("token"));
  return fetchUtils.fetchJson(url, options);
};

function App() {
  return (
    <Admin
      dashboard={Dashboard}
      loginPage={LoginPage}
      authProvider={authProvider}
      dataProvider={restProvider(API_URL, httpClient)}
      layout={MyLayout}
    >
      <Resource name="shops" label="Shop" list={ShopsList} edit={ShopEdit} />
      <Resource
        name="categories"
        label="Categoies"
        permission={authProvider.getPermissions()}
        list={CategoriesList}
      />
    </Admin>
  );
}

export default App;
