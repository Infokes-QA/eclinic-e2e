import { ENV } from "./env";
import { ROUTES, Route } from "./routes";

export class UrlHelper {
  static get(route: Route): string {
    return `${ENV.BASE_URL}${ROUTES[route]}`;
  }
}
