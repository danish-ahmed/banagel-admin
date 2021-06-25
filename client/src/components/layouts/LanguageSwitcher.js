import * as React from "react";
import { Component } from "react";
import Button from "@material-ui/core/Button";
import { useLocale, useSetLocale } from "react-admin";

const LocaleSwitcher = () => {
  const locale = useLocale();
  const setLocale = useSetLocale();
  return (
    <div>
      <Button
        variant="outlined"
        disabled={locale === "de"}
        onClick={() => setLocale("de")}
      >
        DE
      </Button>
      <Button
        variant="outlined"
        disabled={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
    </div>
  );
};

export default LocaleSwitcher;
