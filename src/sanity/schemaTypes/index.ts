import { type SchemaTypeDefinition } from "sanity";
import { navigation } from "./navigation";
import { footer } from "./footer";
import { aboutPage } from "./aboutPage";
import { architecturePage } from "./architecturePage";
import { interiorsPage } from "./interiorsPage";
import { peoplePage } from "./peoplePage";
import { contactPage } from "./contactPage";
import { newsPost } from "./newsPost";

export const schema: { types: SchemaTypeDefinition[] } = {
 types: [
  // Singletons
  navigation,
  footer,
  aboutPage,
  // architecturePage,
  // interiorsPage,
  peoplePage,
  contactPage,
  // Multi-document
  newsPost,
 ],
};
