#!/usr/bin/env node

var cordova_util = require('cordova-lib/src/cordova/util');
var projectRoot = cordova_util.isCordova(process.cwd());
var projectXml = cordova_util.projectConfig(projectRoot);
var ConfigParser = require('cordova-lib/src/ConfigParser/ConfigParser');
var projectConfig = new ConfigParser(projectXml);
var projectPlatforms = cordova_util.listPlatforms(projectRoot);
projectConfig.name();

var fs = require ('fs');

var platformDir = {
  ios: {},
  android: {
    icon:"res/drawable-{$density}",
    splash:"res/drawable-{$density}",
    nameMap: {
      "icon-36-ldpi.png": "icon.png",
      "icon-48-mdpi.png": "icon.png",
      "icon-72-hdpi.png": "icon.png",
      "icon-96-xhdpi.png": "icon.png"
	  /*,
      "screen-ldpi-portrait.png": "ic_launcher.png",
      "screen-mdpi-portrait.png": "ic_launcher.png",
      "screen-hdpi-portrait.png": "ic_launcher.png",
      "screen-xhdpi-portrait.png": "ic_launcher.png"*/
    }
  },
  blackberry10: {},
  wp7: {},
  wp8: {}
}

function copyAsset (scope, node) {

  var platform = node.attrib['gap:platform'];
  var density  = node.attrib['gap:density'];
  var assetDirTmpl = platformDir[platform] && platformDir[platform][scope];

  if (!assetDirTmpl) {
    throw new Error('Platform and density not supported: ' + platform + ', ' + density);
  }

  var dict = {
    projectName: projectConfig.name(),
    density: density
  };

  var assetDir = assetDirTmpl.replace(/{\$([^}]+)}/, function (match, p1) {
    return dict[p1];
  });

  var srcPath = 'www/'+node.attrib.src;
  var fileName = srcPath.match(/[^\/]+$/)[0];
  if (platformDir[platform] && platformDir[platform].nameMap && platformDir[platform].nameMap[fileName]) {
    fileName = platformDir[platform].nameMap[fileName];
  } else {
    throw new Error('Unknown icon name for platform ' + platform);
  }
  var dstPath = 'platforms/'+platform+'/'+assetDir+'/'+fileName;

  console.log ('copying from '+srcPath+' to the '+dstPath);
  // so, here we start to copy asset
  fs.stat (srcPath, function (err, stats) {
    if (err) {
      throw err;
    }
    var r = fs.createReadStream(srcPath);
    r.on ('open', function () {
      r.pause();
      var w = fs.createWriteStream(dstPath);
      w.on ('open', function () {
        r.pipe(w);
        r.resume();
      });
      w.on ('error', function() {
        throw new Error('Cannot write file');
      })
    });
    r.on ('error', function() {
      throw new Error('Cannot read file');
    });
  });
}

projectConfig.doc.findall('icon').map(function (node) {
  if (/\/$/.test(node.attrib['src']) && node.attrib['gap:platform'] === undefined && node.attrib['gap:density'] === undefined) {

    if (~projectPlatforms.indexOf('android')) {
      // Android
      copyAsset('icon', { attrib: { 'gap:platform': 'android', src: node.attrib.src + 'android/icon-36-ldpi.png', 'gap:density': 'ldpi' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'android', src: node.attrib.src + 'android/icon-48-mdpi.png', 'gap:density': 'mdpi' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'android', src: node.attrib.src + 'android/icon-72-hdpi.png', 'gap:density': 'hdpi' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'android', src: node.attrib.src + 'android/icon-96-xhdpi.png', 'gap:density': 'xhdpi' } });
    }

    if (~projectPlatforms.indexOf('ios')) {
      // iOS >= 7 Settings icon
      // iOS <= 6.1 Small icon for Spotlight search results and Settings (recommended) iPhone
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-29.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-29-2x.png' } });

      // iOS >= 7 Spotlight search results icon (recommended)
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-40.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-40-2x.png' } });

      // iOS <= 6.1 Small icon for Spotlight search results and Settings (recommended) iPad
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-50.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-50-2x.png' } });

      // iOS <= 6.1 App icon (required) iPhone
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-57.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-57-2x.png' } });

      // iOS >= 7 App icon (required) iPhone
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-60.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-60-2x.png' } });

      // iOS <= 6.1 App icon (required) iPad
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-72.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-72-2x.png' } });

      // iOS 7 App icon (required) iPad
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-76.png' } });
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.attrib.src + 'ios/icon-76-2x.png' } });
    }

  } else {
    copyAsset ('icon', node);
  }
});

projectConfig.doc.findall('*').filter(function (node) {
  return (node.tag == 'gap:splash');
}).map(function (node) {
  copyAsset ('splash', node);
});
