# Rocket League OBS Scene Switcher

An automated way to switch OBS scenes based on events in Rocket League. This uses the SOS plugin developed first by SimpleAOB and taken over by Eoin Bathurst, which is located here: [SOS Plugin](https://github.com/SilentEchoGM/sos-monorepo/tree/main/packages/release/sos-plugin).


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

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc  