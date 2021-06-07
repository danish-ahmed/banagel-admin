import * as React from "react";
import { Layout, AppBar } from "react-admin";
import { Box, Typography } from "@material-ui/core";
import { ToggleThemeButton } from "@react-admin/ra-preferences";

const MyAppBar = (props) => (
  <AppBar {...props}>
    <Box flex="1">
      <Typography variant="h6" id="react-admin-title"></Typography>
    </Box>
    <ToggleThemeButton />
  </AppBar>
);

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
