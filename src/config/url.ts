import { ENV } from "./env";
import { ROUTES, Route } from "./routes";

export class UrlHelper {
  static get(route: Route): string {
    return `${ENV.BASE_URL}${ROUTES[route]}`;
  }

  static getHomeUrlPattern(): RegExp {
    const homePath = ROUTES.home.replace(/\//g, "\\/");
    return new RegExp(`.*${homePath}(\\?.*)?$`);
  }

  static buildHomeUrl(origin: string): string {
    return `${origin}${ROUTES.home}`;
  }

  static buildAuthenticatedHomeUrl(origin: string): string {
    const homeUrl = `${origin}${ROUTES.home}`;

    if (!ENV.AUTH_HOME_QUERY) {
      return homeUrl;
    }

    return `${homeUrl}?${ENV.AUTH_HOME_QUERY}`;
  }

  static getAuthenticatedHomeUrl(): string {
    return this.buildAuthenticatedHomeUrl(new URL(ENV.BASE_URL).origin);
  }

  static buildLoginUrl(origin: string): string {
    return `${origin}${ROUTES.login}`;
  }

  static getLoginUrlPattern(): RegExp {
    const loginPath = ROUTES.login.replace(/\//g, "\\/");
    return new RegExp(`.*${loginPath}\\/?(\\?.*)?$`);
  }
}