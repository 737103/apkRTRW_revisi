import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.aplikasirtrw.app",
  appName: "Aplikasi RT/RW",
  webDir: "out",
  server: {
    androidScheme: "https"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  },
  cordova: {}
};

export default config;