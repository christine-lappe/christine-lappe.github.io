"use strict";

let current_r = 0;
let current_g = 0;
let current_b = 0;
let color = [1,0,1];


const clientID = "clientID-" + parseInt(Math.random() * 100);
const host = 'broker.emqx.io';
const port = '8084';
// Initialize new Paho client connection
let client = new Paho.MQTT.Client(host, Number(port), clientID);

console.log("test no func");

let message_from_mqtt = "fortest"; //--> from Gary, necessary?

//var csvContent; 


function idStructure(){  // CURRENTLY NOT USED


    //get my constants 
    let iframeElement = document.getElementById("embeddedViewer");
    let  viewer = iframeElement.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    
    //access certain parts of metaObjects (skip the second level)
    const allObjects = Object.values(metaObjects);

    var objArray = [["Type", "Name", "Id"]];

    //var allTypes = [];
    //var allNames = [];
    //var allIds = [];
    allObjects.forEach(function(element){
        //element is the variable for each object 

        var newLength = objArray.push([element.type, element.name, element.id]);

        //var newType = allTypes.push([element.type]);
        //var newName = allNames.push([element.name]);
        //var newId = allIds.push([element.id])
    });
    /*
    allTypes = allTypes.flat(1);
    allNames = allNames.flat(1);
    allIds = allIds.flat(1);

    var yxArray = [allTypes, allNames, allIds]; // might not be needed
    console.log(objArray);
    console.log(yxArray); 
    console.log(allTypes);
    console.log(allNames);
    console.log(allIds);
    let newObjArray = objArray.unshift(["Type", "Name", "Id"]);
    
    const rows = objArray;
    csvContent = "data:text/csv;charset=utf-8, \n";

    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    */
   return objArray
}


function changeDefaultColors(objArray){
    //change the id based assigning to a type based one!!
    let iframeElement = document.getElementById("embeddedViewer");
    //console.log(iframeElement);
    let  viewer = iframeElement.contentWindow.bimViewer.viewer;
    //console.log (viewer.scene.objects);
    objArray = idStructure();
    //console.log(objArray);
    let siteId = [];
    let wallId = [];
    let waterId = [];
    objArray.forEach(function(element){
        if (element[0] === "IfcSite"){
            let newSite = siteId.push(element[2]);
        }
    });
    objArray.forEach(function(element){
        if(element[0] === "IfcWall" || element[0] ===  "IfcWallStandardCase" || element[0] === "IfcColumn"){
            let newWall = wallId.push(element[2]);
        }
    });
    objArray.forEach(function(element){
        if(element[1]=== "Water" || element[1].includes("W00")){
            let newWater = waterId.push(element[2]);
        }
    });

    siteId.forEach(function(element){
        try{
            viewer.scene.objects[element].colorize = [0.12, 0.35, 0.05];
        } catch{

        }
    });

    wallId.forEach(function(element){
        try{
            viewer.scene.objects[element].colorize = [0.4, 0.4, 0.4]; 
        } catch{

        }
    });

    waterId.forEach(function(element){
        try{
            viewer.scene.objects[element].colorize = [0.05, 0.1, 0.4]; 
        } catch{

        };
        try{
            viewer.scene.objects[element].opacity = 0.7;
        } catch{

        }
    })
}

function startConnect() {
// Generate a random client ID

    // Fetch the hostname/IP address and port number from the form
    //host = document.getElementById("host").value; -->
    // port = document.getElementById("port").value; -->
    console.log("connecting")
 

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
        useSSL: true
    });

    console.info(client)
    }

    // Called when the client connects
    function onConnect() {
        // Fetch the MQTT topic from the form
        //topic = document.getElementById("topic").value;

        // Print output for the user in the messages div
        //document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

        // Subscribe to the requested topics

        console.log("subscribing");
        const  channel = "rwth/SHMviewer/#" ;
        client.subscribe(channel);
        console.log ("subscribed to "+channel);

    }

    // Called when the client loses its connection
    function onConnectionLost(responseObject) {
    //    <!-- document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    //    if (responseObject.errorCode !== 0) {
    //       document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    //   } -->

        console.log("connection lost")
        if (responseObject.errorCode !== 0) {
            console.log(responseObject.errorMessage);
        }
    }


// Called when a message arrives
    function onMessageArrived(message) {
        
        //will try setting those to const and put the "create csv" part earlier in the script, maybe with my own function
        let iframeElement = document.getElementById("embeddedViewer");
        let  viewer = iframeElement.contentWindow.bimViewer.viewer;
        let metaObjects = viewer.metaScene.metaObjects;
        console.log(metaObjects["id", "name", "type"]);
/*
        // create csv 
        const items = metaObjects["id", "name", "type"];
        const replacer = (key, value) => value === null ? '' : value; // specify my null value here
        const header = Object.keys(items[0]);
        const csv = [
            header.join(','), //header row first
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')).join(','))
        ].join('\r\n');
        
        console.log(csv);

        csv.unshift(fields.join(',')); // add header column
         csv = csv.join('\r\n');
        console.log(csv);
        // need to save csv somewhere?
        
        // in Excel(?): add the sensorID collumn  
        
        // get csv file (replace Test.csv with Objects.csv) -> this part is already tested and works
        let csvarray = [];
        let client = new XMLHttpRequest();
        client.open('GET', '/docs/Test.csv');
        client.onreadystatechange = function() {
            let rows = client.responseText.split('\n');
            for(let i = 0; i < rows.length; i++){
                csvarray.push(rows[i].split(','));
            }
        }
        client.send();
        console.log(csvarray);  */

        // (where message has to arrive latest)
        //JSON object with two values extracted to sensorID and color 
        
            console.log(message.payloadString);
            let msg = JSON.parse(message.payloadString);
             //console.log(msg);
            let sensor = msg.sensorID;
            let color = msg.color;
            console.log(sensor);
            console.log(color);

            //get element from sensor -> only for testing until real swap! 
            function Exchange (sensor){
                return sensor === USL01 ? "2_BxCgw6zEARAkB6iaS_fp" 
                    : sensor === R001 ? "0In9GSkUj0kAjvuqTrNojT"
                    : console.log("no sensor connected");
            }
            
            let selObjTest = Exchange(sensor);
            console.log(selObjTest);
            
            // extended exchange from sensorID to elementID
            // find position of certain sensorID
            let index = csvarray.indexOf(sensor);
            console.log(index)
            // find elementID at same position 
            // if the index is a number that gives the placement of the whole inner object:
            let selObj = csvarray.index.elementID
            console.log(selObj)
        
            //console.log(iframeElement);
            
            console.log("selected Object:\r"+ selObj); 
            
            console.log (metaObjects);
            let ObjectList = Object.entries(metaObjects);
            console.log (ObjectList);
            let myItem = metaObjects[String(selObj)];
            console.log(myItem.id);
            let entity = viewer.scene.objects[myItem.id];


            entity.colorize = color;
            console.log("test")
        

    }

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}

    function init() {

        startConnect();
        const iframeBaseURL = "./../app/index.html?projectId=WaterLock";
        let iframeElement = document.getElementById("embeddedViewer");
        if (!iframeElement) {
            throw "IFRAME not found";
        }
    
        let viewer = iframeElement.contentWindow.bimViewer; 
        // is the model loaded?
        if (viewer.isModelLoaded("design")){
            console.log("loading completed");
            // attention: Hard coded model name!!! ('design'), please change for other models or make parameter for function
            //console.log(`model loaded is ${viewer.isModelLoaded("design")} ${window.loadMonitorID}`);
            
            // remove the interval 
            window.clearInterval(loaderInt);
            console.log(`model loaded`);
            
            //idStructure();
            changeDefaultColors();
            
            //console.log("csv created") //tests for successful idStructure() execution
                            
        } else if (countInterval === 5){
            window.clearInterval(loaderInt)
            console.log("loading failed") 
        } else {
            console.log('waiting to load model....')

        }
        window.selectObject = function (checkbox) {

            const objectId = checkbox.name;

            if (checkbox.checked) {
                objectIdsUsed[objectId] = true;
            } else {
                delete objectIdsUsed[objectId];
            }

            const objectIds = Object.keys(objectIdsUsed);

            if (objectIds.length === 0) {
                iframeElement.src = iframeBaseURL + "#actions=clearFocusObjects";
            } else {
                const objectIdsParam = objectIds.join(",");
                iframeElement.src = iframeBaseURL + "#actions=focusObjects,openTab&objectIds=" + objectIdsParam + "&tabId=objects";
            }
        }

/*
        scene.input.on("mouseclicked", function (coords) {
            var hit = scene.pick({ canvasPos: coords }); if (hit) { var entity = hit.entity; var metaObject = viewer.metaScene.metaObjects[entity.id]; if (metaObject) { console.log(JSON.stringify(metaObject.getJSON(), null, "\t")); } else { const parent = entity.parent; if (parent) { metaObject = viewer.metaScene.metaObjects[parent.id]; if (metaObject) {
                            console.log(JSON.stringify(metaObject.getJSON(), null, "\t"));
                        }
                    }
                }
            }
        });
*/
    } 