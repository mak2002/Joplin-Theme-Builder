import joplin from "api";
import { ToolbarButtonLocation } from "api/types";
const fs = joplin.require("fs-extra");

const uslug = require("@joplin/fork-uslug");

joplin.plugins.register({
  onStart: async function () {
    // open developer mode

    const installDir = await joplin.plugins.installationDir();
    const HTML = installDir + "/webview.html";
    const themeCSS = installDir + '/cssFiles' + "/theme.css";
 
    await joplin.window.loadChromeCssFile(themeCSS);
    const panels = joplin.views.panels;

    const view = await panels.create("panel_1");

    const html = await fs.readFile(HTML, "utf8");

    await panels.setHtml(view, html);
    await panels.addScript(view, './webview.js');
    await panels.addScript(view, "./webview.css");

    // Listening for message from webview
    await joplin.views.panels.onMessage(view, async (message: any) => {
      console.log(message);

      if (message.name === "setTheme") {
        // const userCSS = installDir + 'user.css';

        await fs.writeFile(themeCSS, message.themeCSS);
        // await fs.writeFile(userCSS, message.userCSS)

        await joplin.window.loadChromeCssFile(themeCSS);
        // await joplin.window.loadNoteCssFile(userCSS);
      }
    });

    
  },
});