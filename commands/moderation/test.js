const vega = require("vega");
const Discord = require("discord.js");
module.exports = {
  name: "test",
  aliases: [],
  category: "moderation",
  description: "",
  usage: "[command]",
  run: async (client, message, args) => {
    let stackedBarChartSpec = require("./chart.json");
    // create a new view instance for a given Vega JSON spec
    let view = new vega.View(vega.parse(stackedBarChartSpec), {
      renderer: "none"
    });
    view.toCanvas().then(function(canvas) {
      var stream = canvas.createPNGStream();
      const attachment = new Discord.MessageAttachment(
        stream,
        "welcome-image.png"
      );
      message.channel.send(attachment);
    });
  }
};
