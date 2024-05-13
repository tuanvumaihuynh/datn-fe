export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  enabled: boolean;
  scopes: string[];
  createdAt: string;
}

export interface ApiKeyCreateResponse {
  id: string;
  name: string;
  prefix: string;
  enabled: boolean;
  scopes: string[];
  token: string;
  createdAt: string;
}
