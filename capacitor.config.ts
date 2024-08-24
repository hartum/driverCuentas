import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.drivercuentas.com',
  appName: 'DriverCuentas',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'none',
    },
    /*
    SplashScreen: {
      launchShowDuration: 3000, // Duración en milisegundos
      launchAutoHide: true, // Auto oculta el splash screen
      backgroundColor: "#e93500", // Color de fondo
      androidScaleType: "CENTER_CROP",
      showSpinner: false, // Puedes activarlo si quieres un spinner
    },*/
  }
};

export default config;
