# Rocket League OBS Scene Switcher

An automated way to switch OBS scenes based on events in Rocket League using WebSockets and Node.js. This uses the SOS plugin developed first by SimpleAOB and taken over by Eoin Bathurst, which is located here: [SOS Plugin](https://github.com/SilentEchoGM/sos-monorepo/tree/main/packages/release/sos-plugin).


## Getting Started
These instructions will guide you through setting up OBS and the SOS plugin for BakkesMod on your computer properly.


## Prerequisites
You will need OBS, Rocket League, and BakkesMod installed.  


### Installing OBS
[Link to the OBS Project site](https://obsproject.com/download)  

If you need assistance installing a program, please check out this video:  
[![Video](http://img.youtube.com/vi/j0SMxEjJnGs/0.jpg)](http://www.youtube.com/watch?v=j0SMxEjJnGs "Computer Fundamentals - Install Software in Windows 10 - How to Download Programs on Laptop Computer")


### Installing Rocket League
Rocket League can be installed from either [Steam](https://steamcommunity.com/app/252950) (if you bought the game prior to free to play) or [Epic Games Launcher](https://store.epicgames.com/en-US/p/rocket-league).


### Installing BakkesMod
BakkesMod is an addon to Rocket League that adds lots of custom features, such as custom training. We will be using it to run the SOS plugin, which will send events to the scene switcher program.

[Link to the BakkesMod site](https://bakkesmod.com/download.php). If you need assistance installing BakkesMod, there is a helpful tutorial video on that page.


### Installing SOS
Now that we have BakkesMod installed, we can add the SOS plugin. This process has many steps to ensure the plugin works correctly, and I have broken them down to make it easier to follow.

1. **First we have to retrieve the SOS plugin, which is located on GitHub here:** [SOS Plugin Download](https://github.com/SilentEchoGM/sos-monorepo/blob/main/packages/release/sos-plugin/SOS.dll).

Now that we are on GitHub, click the download button to download the plugin.

![SOS Plugin Download](./docs/images/SOS%20Plugin%20Download.png)

2. **Next, we have to get to the BakkesMod folder to install the plugin.**

To do this easily, open BakkesMod, click `File` then `Open BakkesMod folder`.

![BakkesMod Folder](./docs/images/BakkesMod%20Folder.png)

3. **This is the BakkesMod folder where all the plugins and settings are stored for the addon.**

The first thing we are doing in here is going to the plugins folder and putting the `SOS.dll` plugin file that we downloaded in step 1.

![BakkesMod Folder List](./docs/images/BakkesMod%20Folder%20List.png)

![SOS Plugin in plugins](./docs/images/SOS%20Plugin%20plugins.png)

4. **Now we need to set up the settings file that SOS uses.**

Navigate to the settings folder in plugins.

![BakkesMod Plugin Settings](./docs/images/BakkesMod%20Plugins%20Settings.png)

You should now see a list of `.set` files. 

**NOTE:** If you do not see the `.set` extension, please follow this tutorial to enable that feature on your OS: [Windows show file extensions](https://www.howtogeek.com/205086/beginner-how-to-make-windows-show-file-extensions/)

Now create a new text file that we will name `sos.set`.

![Create Empty Text File](./docs/images/BakkesMod%20Settings%20Create%20File.png)

You may get a prompt warning you that the file might become unusable. You can click `Yes` without having to worry.

![Renaming Prompt](./docs/images/Renaming%20Prompt.png)

Once you rename the file, your settings files should look like this.

![Settings file create](./docs/images/Settings%20file%20created.png)

Now that we have the settings file for SOS, open it with Notepad and put in the following:
```
SOS - Overlay System
5|Rate at which to send events to websocket (milliseconds)|SOS_state_flush_rate|15|2000
9|Original dll code by gboddin, modified and extended by SimpleAOB
```

5. **The final step to getting the SOS plugin working in BakkesMod is to tell BakkesMod to load the plugin. To do this, we will need to go back to the BakkesMod folder and go into the cfg (config) flolder.**

![Config Folder](./docs/images/BakkesMod%20Config%20Folder.png)

In here, we need to open the `plugins.cfg` file in notepad.

![Inside Config](./docs/images/BakkesMod%20Inside%20Config.png)

And then we add `plugin load sos` to the line above `writeplugins`.

![Load SOS](./docs/images/BakkesMod%20Load%20SOS.png)


### Configuring OBS
Doing this will allow us to control OBS with the Rocket League OBS Scene Switcher.

1. **Open OBS and go to the `Tools` dropdown in the menu bar and the click `WebSocket Server Settings`**

**NOTE**: If `WebSocket Server Settings` is not an option, your OBS is out of date and should be updated to version 28 or newer!

![OBS Tools](./docs/images/OBS%20Tools.png)

2. **We now need to enable the WebSocket server that this program will interact with. Click the checkbox to enable the server and then click on `Show Connect Info`.**

![OBS Enable WebSocket](./docs/images/OBS%20Enable%20Websocket.png)

3. **The password will be used in the Configuration Tool later in the next step, so don't close it!**

![OBS WebSocket Info](./docs/images/OBS%20Websocket%20Info.png)


## Using Rocket League OBS Scene Switcher

### Using the Configuration Tool
This tool is used to change the behaviour of the scene switcher when it receives an event from Rocket League.

At the top of the application, we have the connections information. The only thing that should need to be changed is the password for the OBS WebSocket Server. 

![Config Tool Connections](./docs/images/Config%20Tool%20Connections.png)

After you insert your password, you can click the `Connect to OBS` button and it shoud connect.

![Config Tool Connected](./docs/images/Config%20Tool%20Connected.png)

- Event: The event received from Rocket League
- Scene: The scene that you want OBS to transition to after the event occurs
- Delay: The time (in milliseconds) that you want the program to delay before the transition occurs
- Enabled: Provides the ability to completely disable that event from affecting OBS

**NOTE**: The program will read the config every 2.5 seconds so any changes applied here will be applied in realtime. 

You should notice that there is a {teamName} placeholder for `Goal Scored` and for `Match Ended` events. This allows you to have custom scenes based on the team that scored the goal or won the game. 

Here is my example scene list:

![OBS Scene List](./docs/images/OBS%20Scene%20List.png)

This means that if the Bluey team scored a goal, the {teamName} Replay would be changed to Bluey Replay. 

If you do not want this functionality, and just want to transition to a single scene, just change the name to name of the scene you want it to transition to.

### Using the Scene Switcher
If all has gone well, you can now run the `Scene-Switcher.exe` program. You should see that both OBS and Rocket League have connected, as seen below.

![Scene Switcher Connected](./docs/images/Scene%20Switcher%20Connected.png)

## Built With

* [obs-websocket-js](https://github.com/obs-websocket-community-projects/obs-websocket-js) - The websocket for communicating with OBS

## Authors

* **Travis Roy** - *Initial work* - [travisrroy](https://github.com/travisrroy)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspiration was from a project called Codename: Covert in which the SOS plugin was used
