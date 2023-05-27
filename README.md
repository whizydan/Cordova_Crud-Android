## M-expense

This application was written using cordova and tested on platform android.

# build instructions

To run this build this application you need to install cordova and npm consequently since cordova is available as an npm package.

to start download and install node.
then open a terminal and use the command

`npm install -g cordova # (in case you don't have cordova)`

then after installing cordova,refresh your shell then 

`cordova plugin add cordova-sqlite-storage # --save RECOMMENDED for Cordova CLI pre-7.0`

for details on how the above sqlite library works please see [github](https://github.com/storesafe/cordova-sqlite-storage)

`cordova platform add android # repeat for all desired platform(s)`

for cordova-ios pre-4.3.0 (Cordova CLI pre-6.4.0) you need to run

`cordova prepare`

once you are done you can now  build and deploy the app

`cordova build android`

and consequently it will provide the path for you,you can use adb to install

`adb install -t <path to the apk>`

please note that this is a debug version version so the -t is necessary or it won't install.

thats it!enjoy😉