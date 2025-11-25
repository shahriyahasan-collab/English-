// Manually declare process.env since vite/client types are missing in this environment
declare const process: {
  env: {
    [key: string]: string | undefined;
    API_KEY: string;
  }
};
