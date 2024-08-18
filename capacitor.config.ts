import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'DriverCuentas',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'none',
    },
  }
};

export default config;
