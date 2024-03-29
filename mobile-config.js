App.info({
  name: 'Gavel',
  description: 'Don anymore time waiting for court updates. Use gavel and get push notifications in realtime.',
  version: '0.0.1'
});

App.icons({
  // iOS
  // 'iphone': 'resources/icons/icon-60x60.png',
  // 'iphone_2x': 'resources/icons/icon-60x60@2x.png',
  // 'ipad': 'resources/icons/icon-72x72.png',
  // 'ipad_2x': 'resources/icons/icon-72x72@2x.png',

  // Android
  // 'android_ldpi': 'resources/icons/gavel.png',
  // 'android_mdpi': 'resources/icons/gavel.png',
   'android_hdpi': 'resources/icons/gavel1.png',
   'android_xhdpi': 'resources/icons/gavel1.png'
});

App.launchScreens({
  // iOS
  // 'iphone': 'resources/splash/splash-320x480.png',
  // 'iphone_2x': 'resources/splash/splash-320x480@2x.png',
  // 'iphone5': 'resources/splash/splash-320x568@2x.png',
  // 'ipad_portrait': 'resources/splash/splash-768x1024.png',
  // 'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.png',
  // 'ipad_landscape': 'resources/splash/splash-1024x768.png',
  // 'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.png',

  // Android
  //  'android_ldpi_portrait': 'resources/splash/splash.png',
  // 'android_ldpi_landscape': 'resources/splash/splash.png',
  // 'android_mdpi_portrait': 'resources/splash/splash.png',
  // 'android_mdpi_landscape': 'resources/splash/splash.png',
  'android_hdpi_portrait': 'resources/splash/splash_screen.png',
  // 'android_hdpi_landscape': 'resources/splash/splash.png',
  'android_xhdpi_portrait': 'resources/splash/splash_screen.png'//,
  //'android_xhdpi_landscape': 'resources/splash/splash.png'
});

App.accessRule('http://*');
App.accessRule('https://*');