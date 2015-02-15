# RFduino LEGO PowerFunctions - Mobile Client

This is a Cordova-based mobile application which implements the client-side of the RFduino LEGO PowerFunctions project. In combination with a RFduino unit, some additional circuitry and the right piece of sketch running on the unit, this application can be used to steer a LEGO model based on LEGO PowerFunctions motors.

A first working prototype of this application was implemented during the Accso Hackathon 2015, at which we got the chance to tinker around with RFduino units. We used Evothings Studio for prototyping the client-side of the solution and were quite content with the experience.

Although we got the basic communication between the application and the RFduino unit working during the Hackathon, the prototype lacked in terms of code quality and design. Hence, we did some improvements, reworked the application protocol between the app and the RFduino and integrated a ready-to-use virtual joystick which provides an intuitive to control a LEGO vehicle.
