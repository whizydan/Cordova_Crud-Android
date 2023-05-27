document.addEventListener("deviceready", onDeviceReady, false);
//register global variables
var id;
var db;


function onDeviceReady() {

    //initialise database
        db = window.sqlitePlugin.openDatabase({
            name: 'mexpense.db',
            location: 'default',
            androidDatabaseProvider: 'system',
            androidLockWorkaround: 1
        });
        //get url parameters matching id
        var url_string = document.location.href; //window.location.href
        var url = new URL(url_string);
        id = url.searchParams.get("id");
        fetchSingleTrip()
        //register onclick event listeners instead of using inline scripts
        document.getElementById("update").addEventListener("click",updateTrip);
        document.getElementById("delete").addEventListener("click",deleteTrip);
}

function fetchSingleTrip(){
    //query database for records of id,then prefill fields with said data
    db.transaction(function(tx){
        tx.executeSql("select * from trips where id="+id,[],function(tx1,result){
            var len = result.rows.length;
            document.getElementById("delname").value = result.rows.item(0).name;
            document.getElementById("deldestination").value = result.rows.item(0).destination;
            document.getElementById("deldate").value = result.rows.item(0).date;
            document.getElementById("deldescription").value = result.item(0).description;
            document.getElementById("delrisk").value = result.item(0).risk;
            document.getElementById("delcompanions").value = result.item(0).companions;

        })
    })
    
}
function updateTrip(){
    //get user input
    var name = document.getElementById("delname").value;
    var dest = document.getElementById("deldestination").value;
    var date = document.getElementById("deldate").value;
    var desc = document.getElementById("deldescription").value;
    var risk = document.getElementById("delrisk").value;
    var companion = document.getElementById("delcompanions").value;
    var choice = document.getElementById("delrisk").value;

    if(name != "" & choice != "" & dest != "" & date != "" & risk != ""){
        //check for null values
        db.transaction(function(tx) {
            tx.executeSql('UPDATE trips SET name="'+name+'" ,destination="'+dest+'" , date = "'+date+'" , description= "'+desc+'" , risk = "'+choice+'" , companions="'+companion+'"  where id="'+id+'"');
          }, function(error) {
            alert(error.message)
            
          }, function() {
            alert("success")
            window.open("https://localhost/index.html")
            
          });
        }
    

}
function deleteTrip(){
//delete record matching id from url parameter
    db.transaction(function(tx){
        tx.executeSql("delete from trips where id="+id)
    },function(error){
        alert(error.message)
    },function(){
        window.open("https://localhost/index.html")
    }
    )
    
}
