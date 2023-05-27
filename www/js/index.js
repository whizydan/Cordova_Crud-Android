/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

//database global variable
var db;


function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    //initialize the database
    db = window.sqlitePlugin.openDatabase({
        name: 'mexpense.db',
        location: 'default',
        androidDatabaseProvider: 'system',
        androidLockWorkaround: 1
      });
    
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //load the data to the UI
    fetchData();
    //register onclick events -- most browsers disable inline javascript so this is the workaround
    document.getElementById("deleteall").addEventListener("click",deleteAll);
    document.getElementById("add").addEventListener("click",addTrip);
    
      
}


function fetchData(){
  //get data from database and populate the view
    db.transaction(function(tx){
    tx.executeSql("select * from trips order by id desc",[],function(tx1,result){  
      //get the reult of the transaction and loop over each row while displaying records in each row
            var len = result.rows.length;
            var tblText= '<li  class="list-group-item"><div class="card mb-3" style="max-width: 540px;"><div class="row g-0"><div class="col-md-4"></div><div class="col-md-8"><div class="card-body">';
            
            if(len > 0){
              //get rid of empty view when there are no records in the database
              for (var i=0; i<len; i++){
            var j=i+1;
                        var name = result.rows.item(i).name;
                        var destination = result.rows.item(i).destination;
                        var date = result.rows.item(i).date;
                        var description = result.rows.item(i).description;
                        var risk = result.rows.item(i).risk;
                        var trip_id = result.rows.item(i).id;
                        var companions = result.rows.item(i).companions;

                        tblText += '<div class="card-header"><img src="img/logo.png" width="50" height="50" class="img-fluid rounded-start" ></div><h5 class="card-title">' + destination + '</h5><p class="card-text">' + description + '</p>' +
                        '<p class="card-text"><small class="text-muted">Date: ' + date + ' <br>    risk assessment:' + risk + '</small></p>'+
                        '<p class="card-text"><small class="text-muted">Travelling along with: ' + companions + '</small></p>'+
                      '</div></div><div class="card-footer text-end"><div class="btn-group" role="group" aria-label="Basic example">'+
                          '<a href="delete.html?id='+ trip_id +'"><button type="button" class="btn btn-primary">View</button></a></div></div></div></div>';
            }
            tblText +="</li><br><br>";
            document.getElementById("tblDiv").innerHTML =tblText;
            }
            
 
        });
    },function(error){
      //log the error to the terminal
        log.console(error.message)
    },function(){
        //log the success of the operation
        log.console("transaction: populate view -> SUCCESS")
    });
}


function addTrip(){
  //add new trip function , get all variables from input
    var name = document.getElementById('name').value;
    var destination = document.getElementById('destination').value;
    var date = document.getElementById('date').value;
    var desc = document.getElementById('description').value;
    var choice = document.getElementById('risk').value;
    var companions = document.getElementById('companions').value;
    

    if(name != "" & choice != "" & destination != "" & date != ""){
      //workaround for submission since button onclick is not dependent on form submission
    db.transaction(function(tx) {
      //recreate tables incase database is not existent or incomplete
        tx.executeSql('CREATE TABLE IF NOT EXISTS trips (id INTEGER, name TEXT, destination TEXT, date TEXT, description TEXT, risk TEXT, companions TEXT, PRIMARY KEY(id AUTOINCREMENT))');
        tx.executeSql('INSERT INTO trips VALUES (?,?,?,?,?,?,?)', [null, name, destination, date, desc, choice, companions]);
      }, function(error) {
        //show the error
        alert(error.message)
        
      }, function() {
        //log the transaction
        console.log("transaction : insert records -> SUCCESS")
        
      });
    }
}


function deleteAll(){
    //delete database instead of deleting rows to disable fake value displayed in the view
    window.sqlitePlugin.deleteDatabase({name: 'mexpense.db', location: 'default'});
    //reload the page
    location.reload();
}

