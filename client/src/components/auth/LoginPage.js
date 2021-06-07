import * as React from "react";
import { useState } from "react";
import {
  useLogin,
  useNotify,
  Notification,
  defaultTheme,
  Login,
} from "react-admin";
import { ThemeProvider } from "@material-ui/styles";
import { TextField, Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { createMuiTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const LoginPage = ({ theme }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(0);
  const login = useLogin();
  const notify = useNotify();
  const submit = (e) => {
    e.preventDefault();
    // will call authProvider.login({ email, password })
    login({ email, password }).catch(() => {
      notify("Invalid email or password");
      setError(1);
    });
  };

  return (
    <ThemeProvider theme={createMuiTheme(defaultTheme)}>
      <Login>
        <Container
          component="main"
          maxWidth="xs"
          justify="center"
          maxWidth="sm"
        >
          <form onSubmit={submit} noValidate autoComplete="off">
            <div className={classes.paper}>
              <Typography variant="h5" component="h5">
                Login
              </Typography>
              <FormControl fullWidth>
                <TextField
                  type="email"
                  id="email"
                  label="Email"
                  name="email"
                  value={email}
                  error={error}
                  onChange={(e) => {
                    setError(0);
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
              <br />
              <FormControl fullWidth>
                <TextField
                  type="password"
                  id="password"
                  label="Password"
                  name="password"
                  error={error}
                  value={password}
                  onChange={(e) => {
                    setError(0);
                    setPassword(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl fullwidth>
                <Box component="div" m={1}>
                  <Button
                    disabled={email === "" || password === ""}
                    variant="outlined"
                    color="primary"
                    onClick={submit}
                  >
                    Login
                  </Button>
                </Box>
              </FormControl>
            </div>
          </form>
        </Container>
      </Login>
      <Notification />
    </ThemeProvider>
  );
};

export default LoginPage;
