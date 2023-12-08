const db = require("./optimized_by_gpt");

const dbName = "test";



// Create a collection

// db.createCollection(dbName, (success, message) => {
//     if (success) {
//         console.log(message);
//     } else {
//         console.log("error. ",message);
//     }
// });



// Adding some dummy data

//  adding data with insertOne
// db.insertOne(dbName, { name: "Sanan", age: 24 }, (success, data, message) => {
//   if (success) {
//     console.log(data, message);
//   }
//   else{
//      console.log("error. ",message);
//   }
// });


//  adding data with insertMany
// db.insertMany(dbName, [{ name: "Sanan", age: 24 }, { name: "Junaid", age: 32}, { name: "Sulman" }], (success, data, message) => {
//   if (success) {
//     console.log(data);
//   }
//   else{
//      console.log("error. ",message);
//   }
// });



// Get all the data
// db.getAll(dbName, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     c console.log("error. ",message);
//   }
// });


//  get the count of the total rows
// db.count(dbName, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//      console.log("error. ",message);
//   }
// });

// search data
// db.search("dbName", "name", "Junaid", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//      console.log("error. ",message);
//   }
// });


// get a field values
// db.getFieldValues(dbName,  "age", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });


// search by field/key 
// db.searchByField(dbName,  "age", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });

// filter by condition

// simple condition
// db.filter(dbName,  {age: 24 }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });

// // greater than condition
// db.filter(dbName,  {age: { $gt: 20 }}, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });


// update data
// db.update(dbName,  {age: 24 }, {age: 25 }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });


// delete one 
// db.deleteOne(dbName,  {age: 32 }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ",message);
//   }
// })


// delete one 
// db.deleteMany(dbName,  {name: "Sulman" }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ",message);
//   }
// })

// clear collection
// db.clearCollection(dbName, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ",message);
//   }
// })


// delete collection
// db.deleteCollection(dbName, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ",message);
//   }
// })
