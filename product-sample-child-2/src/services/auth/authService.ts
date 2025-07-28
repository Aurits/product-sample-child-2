import { Auth0Client } from '@auth0/auth0-spa-js';

interface AuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  audience?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

class AuthService {
  private auth0Client: Auth0Client | null = null;
  private user: User | null = null;

  async initialize(config: AuthConfig): Promise<void> {
    this.auth0Client = new Auth0Client({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        redirect_uri: config.redirectUri,
        audience: config.audience,
      },
    });

    try {
      await this.auth0Client.checkSession();
      const user = await this.auth0Client.getUser();
      if (user) {
        this.user = this.mapAuth0User(user);
      }
    } catch (error) {
      console.error('Error checking authentication session:', error);
    }
  }

  async login(): Promise<void> {
    if (!this.auth0Client) {
      throw new Error('Auth service not initialized');
    }
    await this.auth0Client.loginWithRedirect();
  }

  async logout(): Promise<void> {
    if (!this.auth0Client) {
      throw new Error('Auth service not initialized');
    }
    await this.auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    this.user = null;
  }

  async handleRedirectCallback(): Promise<void> {
    if (!this.auth0Client) {
      throw new Error('Auth service not initialized');
    }
    
    const result = await this.auth0Client.handleRedirectCallback();
    const user = await this.auth0Client.getUser();
    
    if (user) {
      this.user = this.mapAuth0User(user);
    }
    
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.auth0Client) {
      throw new Error('Auth service not initialized');
    }
    
    try {
      const token = await this.auth0Client.getTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  getUser(): User | null {
    return this.user;
  }

  hasRole(role: string): boolean {
    if (!this.user) return false;
    return this.user.role === role;
  }

  hasPermission(permission: string): boolean {
    // Implement permission checking based on your needs
    // This could check JWT claims or make an API call
    return true; // Placeholder
  }

  private mapAuth0User(auth0User: any): User {
    return {
      id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      picture: auth0User.picture,
      role: auth0User['https://your-namespace/role'],
    };
  }
}

export const authService = new AuthService();

// React hook for authentication
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        setUser(authService.getUser());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login: () => authService.login(),
    logout: () => authService.logout(),
    getAccessToken: () => authService.getAccessToken(),
    hasRole: (role: string) => authService.hasRole(role),
    hasPermission: (permission: string) => authService.hasPermission(permission),
  };
};