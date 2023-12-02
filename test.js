const db = require("./index");
const path = require("path");
const fs = require("fs");

const dbName = "test";
const dbLocation = path.join(__dirname, "collections/");

// Check if directory exist, create if not
if (!fs.existsSync(dbLocation)) {
  fs.mkdirSync(dbLocation);
}

// Create the table

// db.createTable(dbName, dbLocation, (success, data) => {
//     if (success) {
//         console.log(data);
//     } else {
//         console.log('Error creating table. ' + data);
//     }
// });

// Put some dummy data

// loop to 10 and insert data
// for (let i = 0; i < 10; i++) {
//   // create random user data
//   let randomName = Math.random().toString(36).substring(7);
//   let randomTime = new Date();
//   let randomEmail = Math.random().toString(36).substring(7);
//   randomEmail += "@gmail.com";
//   const user = {
//     name: randomName,
//     time: randomTime,
//     email: randomEmail,
//   };
//   db.insertTableContent(dbName, dbLocation, user, (succ, msg) => {
//     if (succ) {
//       console.log(msg);
//     } else {
//       console.log("An error has occurred. " + msg);
//     }
//   });
// }

// db.insertTableContent(
//   dbName,
//   dbLocation,
//   {
//     name: "Other test.",
//     time: new Date(),
//   },
//   (succ, msg) => {}
// );

// Get all the data

// db.getAll(dbName, dbLocation, (succ, data) => {
//   if (succ) {
//     console.log(data);
//   } else {
//     console.log("The table test does not exist!");
//   }
// });

//  get the count of the total rows

db.count(dbName, dbLocation, (succ, data) => {
  if (succ) {
    console.log(data);
  } else {
    console.log("An error has occurred.");
    console.log(data);
  }
});

// search data
// db.search(dbName, dbLocation, "name", "x4g4gl", (succ, data) => {
//   if (succ) {
//     console.log(data);
//   } else {
//     console.log("An error has occurred.");
//     console.log(data);
//   }
// });

// get a field value
db.getByField(dbName, dbLocation, "age", (succ, data) => {
  if (succ) {
    console.log(data);
  } else {
    console.log("An error has occurred.");
    console.log(data);
  }
});

// delete rows;
// db.deleteMultipleRows(dbName, dbLocation, { name: "Test." }, (succ, msg) => {
//   if (succ) {
//     console.log(msg);

//     // Show the content now
//     db.getAll(dbName, dbLocation, (succ, data) => {
//       if (succ) {
//         console.log(data);
//       }
//     });
//   }
// });

// db.count(dbName, dbLocation, (succ, data) => {
//   if (succ) {
//     console.log(data);
//   } else {
//     console.log("An error has occurred.");
//     console.log(data);
//   }
// });

// Delete all the data
/* console.log('clearTable:')
db.clearTable(dbName, dbLocation, (succ, msg) => {
    if (succ) {
        console.log(msg)

        // Show the content now
        db.getAll(dbName, dbLocation, (succ, data) => {
            if (succ) {
                console.log(data);
            }
        });
    }
}) */
