/**
 * File:          index.ts
 * Author:        Travis Roy
 * Date Created:  Oct 13, 2020
 * Date Modified: May 31, 2023
 * Description:   Main entrypoint of the application
 */

import path from "path";
import SceneManager from "./classes/SceneManager";

const configPath = path.resolve(".", "./src/config.json");

const app = new SceneManager(configPath);
app.init();