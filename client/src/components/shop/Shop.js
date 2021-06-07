import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { DataProviderContext, Loading, Error } from "react-admin";

const Shop = ({ userId }) => {
  const dataProvider = useContext(DataProviderContext);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    dataProvider
      .getOne("shops", { id: userId })
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error />;
  if (!user) return null;

  return (
    <ul>
      <li>Name: {user.name}</li>
      <li>Email: {user.email}</li>
    </ul>
  );
};

export default Shop;
