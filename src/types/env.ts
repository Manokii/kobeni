export interface Env {
  raw: {
    client: string;
    PID: string;
    port: string;
    password: string;
    protocol: string;
  };
  auth: string;
  basePath: string;
}
