//  Description
//    A Hubot script to pull data from the USGS API
//    USGS API documentation can be found at 
//    https://waterservices.usgs.gov/rest/IV-Service.html
//  
//  Dependencies:
//    None
//  
//  Configuration:
//    None
//  
//  Commands:
//    usgs help - Display help in channel
//    usgs alias <friendly name> <usgs sensor>" - Alias a sensor to friendly name
//    usgs forget <friendly name>" - Forget an alias
//    usgs list" - List current aliases
//    usgs data <usgs sensor or alias>" - Get data from a sensor
//  
//  Author:
//    Ed Brereton <edbrereton@gmail.com>
//



module.exports = function (robot) {
    robot.respond("/usgs help/i", (res) => {
        res.send("usgs Commands");
        res.send("usgs alias <friendly name> <usgs sensor>");
        res.send("usgs forget <friendly name>");
        res.send("usgs list");
        res.send("usgs data <usgs sensor or alias>");
    });

    robot.respond("/usgs alias (.*) (.*)/i", (res) => {
        alias = res.match[1];
        site = "usgs" + res.match[2];

        if(robot.brain.data[alias] != undefined) {
            reply = "I already have an alias called " + alias;
        }
        else {
            robot.brain.data[alias] = site;
            reply = "aliased " + site.replace("usgs", "") + " to " + alias
        }

        res.send(reply);
    });

    robot.respond("/usgs list/i", (res) => {
        res.send("Known Aliases: ")
        for (var key in robot.brain.data) {
            if(key != "_private" 
                && robot.brain.data[key] != undefined 
                && typeof(robot.brain.data[key]) != "object"){
                res.send(key + " is USGS site " + robot.brain.data[key]);
            }
        }
    });

    robot.respond("/usgs forget (.*)/i", (res) => {
        alias = res.match[1];

        reply = ""
        if(typeof(robot.brain.data[alias]) == "string"
        && robot.brain.data[alias].substring(0,4) == "usgs") {
            robot.brain.data[alias] = undefined;
            reply = "Alias " + alias + " has been forgotten"
        }
        else {
            reply = "I can't forget that"
        }
   
        res.send(reply);
    });

    robot.respond("/usgs data (.*)/i", (res) => {
        input = res.match[1];

        if (robot.brain.data[input] != undefined
        && typeof(robot.brain.data[alias]) == "string"
        && robot.brain.data[alias].substring(0,4) == "usgs") {
            site = robot.brain.data[input].replace("usgs", "");
        }
        else {
            site = input;
        }

        robot.http("https://waterservices.usgs.gov/nwis/iv/?format=json&sites=" + site + "&siteStatus=all")
            .header('Accept', 'application/json')
            .get()((err, resp, body) => {
                data = {};
                try {
                    data = JSON.parse(body);
                } catch (error) {
                    res.send("Something went wrong - did you use a missing alias?")
                    return;
                }
                

                res.send(data.value.timeSeries[0].sourceInfo.siteName)
                for (var i = 0; i < data.value.timeSeries.length; i++) {
                    res.send(data.value.timeSeries[i].values[0].value[0].dateTime + " - " 
                    + data.value.timeSeries[i].variable.variableName + ", " +
					+ data.value.timeSeries[i].values[0].value[0].value
					+ data.value.timeSeries[i].variable.unit.unitCode);
				}
				
				res.send("Source: https://waterdata.usgs.gov/tx/nwis/uv/?site_no="+site)

				lat = data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude;
				long = data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude;
				res.send("Location: https://www.google.com/maps/place/"+lat+","+long)

                
            });
    });
}
