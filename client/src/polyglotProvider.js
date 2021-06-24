import polyglotI18nProvider from "ra-i18n-polyglot";

const englishMessages = {
  ra: {
    notification: {
      http_error: "Network error. Please retry",
    },
    action: {
      save: "Save",
      delete: "Delete",
    },
    navigation: {
      page_rows_per_page: "Rows per page",
    },
  },
};
const germanMessages = {
  ra: {
    notification: {
      http_error: "Erreur réseau, veuillez réessayer",
    },
    action: {
      save: "Enregistrer",
      delete: "Supprimer",
    },
    navigation: {
      page_rows_per_page: "Pages",
    },
  },
};

const i18nProvider = polyglotI18nProvider(
  (locale) => (locale === "de" ? germanMessages : englishMessages),
  "en" // Default locale
);

export default i18nProvider;
