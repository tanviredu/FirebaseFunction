const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
// response.send("Hello from Firebase!");
// });


exports.addPerson = functions.https.onCall((data,context)=>{
    var firstName = data.firstName;
    var lastName = data.lastName;
    return admin.database().ref('/Person').push({
        firstName:firstName,
        lastName:lastName,
        fullName: firstName+ " "+lastName 
    }).then(()=>{
        console.log("Data is saved");
        this.date();
        return "OK"
        
    })
});

// this is a express function

exports.date = functions.https.onRequest((req,res)=>{
        if(req.method !== "GET"){
            return res.status(500).send('forbidden');
        }
        
        // create a the time stamp eveytime 
        // it hits
        const date = new Date();
        const snapshot = admin.database().ref('/dates').push({
            now: date.toDateString(),
        })
        // sending the date 
        res.send(`Date added ${date.toDateString()}`);

});


// Cloud firestore support
// making cloud firestore triggers

exports.staffAdded = functions.firestore.document('staff/{staffid}').onCreate((snap,context)=>{
    console.info("[+] Staff Member Added")
});

exports.staffDeleted = functions.firestore.document('staff/{staffid}').onDelete((snap,context)=>{
    console.info("[-] Staff Member Deleted")
})
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
exports.staffChanged = functions.firestore.document('staff/{staffid}').onWrite((snap,context)=>{
    console.info("[*] Staff Member Changed")
})



// trigger for real time databse

exports.addtext = functions.database.ref('texts/{textid}').onCreate((snap,context)=>{
    console.log("[*] Text Added");
})


exports.updatetext = functions.database.ref('texts/{textid}').onUpdate((snap,context)=>{
    //const newValue = snap.after.data();
    //const oldValue = snap.before.data();
    // now we are going to update the child property
    return snap.after.ref.child('status').set("this status is updated");

})




exports.deletetext = functions.database.ref('texts/{textid}').onDelete((snap,context)=>{
    console.log("[*] Text Delete");
})


exports.changetext = functions.database.ref('texts/{textid}').onWrite((snap,context)=>{
    console.log("[*] Text Added");
})



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