# Firebase Function / Cloud Function [Tutorial]

​																																		--tanvir rahamn



## Setting up the Project

* install the node js runtime from www.nodejs.org .  it will install the npm package manager too

* install the firebase tools globally with npm [administrative permission might needed]

  ```
  npm install -g firebase-tools
  ```

  

* login with your gmail account

  ```
  firebase login
  ```

* it will open a window give your credentials and give permission .after a successful login this message will show

  ```
  Waiting for authentication...
  
  +  Success! Logged in as tanviredu2018@gmail.com
  ```

   

* Create the firebase project
  * go to www.firebase.google.com
  *  then select the [Add Project]
  * give your project  a name .This case Name us 'MyFunctions'



* go to the console and initialize the project

  ```
  firebase init
  ```

* choose the function and the database both from the list

* because we are going to test  our function  in  a local environment 

* before publishing to the web so we need a emulator 

* choose JavaScript  for the language 



To Test it we go to index.js and then um comment the helloworld function and save it and deploy it with

this command

```
firebase deploy --only functions
```

**You need to install Postman**

after deploy it will provide you the link.Go to the link and you will get **"Hello from Firebase!"**

you can test this with postman too



## Creating the Callable Function





* We are going to create a function that will take a first Name and last Name object and then

  concat  it and send the first Name,last Name,and the full Name

  

  ```javascript
  exports.addPerson = functions.https.onCall((data,context)=>{
          var firstName = data.firstName;
          var lastName = data.lastName;
          return {
              firstName:firstName,
              lastName:lastName,
              fullName: firstName+ " "+lastName 
  
          }
  });
  ```

  

* now deploy the function

  ```
  firebase deploy --only functions addPerson
  ```

  

* now we need to test the function. We are going to test locally so this command to run locally

  ```
  firebase serve
  ```

* it will give you a local url

  in my case it is http://localhost:5000/myfunctions-ba94f/us-central1/addPerson

* open the post man and post this Json in the body with JSON format

  ```
  {
  "data": {
      "firstName":"Tanvir",
      "lastName":"Rahman"
  }
  }
  ```

  

* and the output is

  ```
  {
      "result": {
          "firstName": "Tanvir",
          "lastName": "Rahman",
          "fullName": "Tanvir Rahman"
      }
  }
  ```

  



# Store Data using Firebase 





* to save the data in the database we import some packages

* in the code instead of returning the name we store in the firebase using the push command so the final code will be like this

  ```
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  admin.initializeApp();
  
  exports.addPerson = functions.https.onCall((data,context)=>{
      var firstName = data.firstName;
      var lastName = data.lastName;
      return admin.database().ref('/persons').push ({
          firstName:firstName,
          lastName:lastName,
          fullName: firstName+ " "+lastName 
  
      }).then(()=>{
          console.log("New Person added ");
          return "OK";
      })
  });
  ```

  



* now you need to enable the real time database in the project

* publish the function again 

  ```
  firebase deploy
  ```

  

* but since we are testing locally and the database is not in local so we need a database emulator

* that will create a fake database to work with

* open another terminal run this command



```
firebase emulators:start --only database
```

it will start the database emulator

```
 database git:(master) ✗ firebase emulators:start --only database
i  emulators: Starting emulators: database
!  database: Did not find a Realtime Database rules file specified in a firebase.json config file. The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
i  database: Database Emulator logging to database-debug.log
i  ui: downloading ui-v1.0.0.zip...
Progress: ==============================================================================================> (100% of 4MB)
i  ui: Emulator UI logging to ui-debug.log

┌───────────────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! View status and logs at http://localhost:4000 │
└───────────────────────────────────────────────────────────────────────┘

┌──────────┬────────────────┬────────────────────────────────┐
│ Emulator │ Host:Port      │ View in Emulator UI            │
├──────────┼────────────────┼────────────────────────────────┤
│ Database │ localhost:9000 │ http://localhost:4000/database │
└──────────┴────────────────┴────────────────────────────────┘
  Other reserved ports: 4400, 4500

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
```



* you can test using function and database emulator we are directly using the cloud

* after publishing and then posting the dame data with postman 

* this result will appear if everything all right

* ```
  {
      "result": "OK"
  }
  ```

* and the data will be saved to the database

* Adding one more 

* post this data with postman

  ```
  {
  "data": {
      "firstName":"Parsival",
      "lastName":"ornob"
  }
  }
  ```

  





#  HTTP Event Handler

you can run asynchronous Https event based function using **functions.https.onRequest()** it can also handle get put post and delete like http event

you can trigger this function inside of the other function so every time this update this will update the value 

write a function that can trigger a date and save it

```

exports.date = functions.https.onRequest((req,res)=>{
        // create a the time stamp eveytime 
        // it hits
        const date = new Date();
        const snapshot = admin.database().ref('/dates').push({
            now: date.toDateString(),
        })
        // sending the date 
        res.send(`Date added ${date.toDateString()}`);

});
```



after you do to the publish url you get the date

**now if i add a person can i add the date of changing the data**

so lets change the add person code and add the date reference so now every time this person added a date will be added too

```
exports.addPerson = functions.https.onCall((data,context)=>{
    var firstName = data.firstName;
    var lastName = data.lastName;
    return admin.database().ref('/Person').push({
        firstName:firstName,
        lastName:lastName,
        fullName: firstName+ " "+lastName 
    }).then(()=>{
        console.log("Data is saved");
        
        // this is we added
        this.date();
        
        return "OK"
        
    })
});

```





you can prevent and regulate different type of request so to support only GET request this will be applied

in the date function

```
exports.date = functions.https.onRequest((req,res)=>{
        
        if(req.method != 'GET'){
        return res.status(500).send("Forbidden");
        }
        
        const date = new Date();
        const snapshot = admin.database().ref('/dates').push({
            now: date.toDateString(),
        })
        // sending the date 
        res.send(`Date added ${date.toDateString()}`);

});
```











# Trigger function for Firestore

we can trigger some function that will actively monitor and log the the status of any CRUD operation

in the firestore  . then using  this log we can do other things

suppose some stuff member is going to be added ,updated , Read and deleted 

write the trigger function for the fierstore 



```
exports.staffAdded = functions.firestore.document('/staff/{staffid}').onCreate((snap,context)=>(
    console.info("[+] Staff Member Added")
));

exports.staffDeleted = functions.firestore.document('/staff/{staffid}').onDelete((snap,context)=>(
    console.info("[-] Staff Member Deleted")
))
exports.staffUpdated = functions.firestore.document('/staff/{staffid}').onUpdate((snap,context)=>(
    console.info("[%] Staff Member Updated")
))
exports.staffChanged = functions.firestore.document('/staff/{staffid}').onWrite((snap,context)=>(
    console.info("[*] Staff Member Changed")
))
```





now if you do to the firebase console and then database then firestore

and make changes in the stuff database [if there wan no database create one]

for any CRUD operation in the stuff you will get  a log message

Just go to the functions and then log .

### what can we do with the data



* suppose someone updated a date when it updated you want to send them a message
* or you want to add the date instantly in side the document you can do this with that
* lets do this now

#### change the update and add functionality when it was updated instantly we add a date

```
exports.staffUpdated = functions.firestore.document('staff/{staffid}').onUpdate((snap,context)=>{
    // see the new value after update
    console.info("[% Updated]");
    const newValue = snap.after.data();
    const oldValue = snap.before.data();
    // this will show in the console
    console.log("[*] new : ",newValue);
    console.log("[-] old :",oldValue);

    // add the date field
    // with the updated filed
    return snap.after.ref.set({
        date: new Date()
    },{merge:true})
})
```



## Creating Trigger for the real time database



trigger can be wrote for the real time database too same process different function



make a CRUD operation to the real time database

```

// trigger for real time databse

exports.addtext = functions.database.ref('texts/{textid}').onCreate((snap,context)=>{
    console.log("[*] Text Added");
})


exports.updatetext = functions.database.ref('texts/{textid}').onUpdate((snap,context)=>{
   	console.log("[*] Text updated");
    
})



exports.deletetext = functions.database.ref('texts/{textid}').onDelete((snap,context)=>{
    console.log("[*] Text Delete");
})


exports.changetext = functions.database.ref('texts/{textid}').onWrite((snap,context)=>{
    console.log("[*] Text Added");
})
```

now change the updated function so every time it get updated   a status field will get added as a new field

```


exports.updatetext = functions.database.ref('texts/{textid}').onUpdate((snap,context)=>{
    //const newValue = snap.after.data();
    //const oldValue = snap.before.data();
    // now we are going to update the child property
    return snap.after.ref.child('status').set("this status is updated");

```





# authentication



its almost the same way to create the way like any function

create a user

```
// create user
exports.sendWelcomeEmail = functions.auth.user()
.onCreate((user)=>{
    const email = user.email;
    console.info("User is created");
    
})

exports.sendByeEmail = functions.auth.user()
.onDelete((user)=>{
    const email = user.email;
    console.info("User is Deleted");
    
})

```



then go to the authentication then enable authentication way then create user and you see the function triggered in the log





# Cloud storage 

There are four operation  that the cloud storage support

* onArchive

* onDelete [for deleting]
* onFinaize [after creation
* onMetadataUpdate [changing metadata]

```

// Cloud storage trigger

exports.onArchive = functions.storage.object().onArchive((object)=>{
        console.info("object created");
})


exports.onDelete = functions.storage.object().onDelete((object)=>{
    console.info("object deleted");
})


exports.onarFinalize = functions.storage.object().onFinalize ((object)=>{
    console.info("file created");
})


exports.Metadataupdate = functions.storage.object().onMetadataUpdate((object)=>{
    console.info("metadata changed");
})
```



now deploy it and upload a file in the storage and see the log