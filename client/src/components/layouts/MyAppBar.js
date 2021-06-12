import * as React from "react";
import { AppBar } from "react-admin";
import { Box, Typography } from "@material-ui/core";
import LanguageSwitcher from "./LanguageSwitcher";
const MyAppBar = (props) => (
  <AppBar {...props}>
    <Box flex="1">
      <Typography variant="h6" id="react-admin-title"></Typography>
    </Box>
    <LanguageSwitcher />
  </AppBar>
);
export default MyAppBar;
// const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
