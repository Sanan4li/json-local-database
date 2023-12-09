const db = require("./index");

const dbName = "users";

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
// db.insertMany("users", [{ name: "Sanan", age: 24 }, { name: "Junaid", age: 32}, { name: "Sulman" }], (success, data, message) => {
//   if (success) {
//     console.log(data);
//   }
//   else{
//      console.log("error. ",message);
//   }
// });

// Get all the data
// db.getAll("users", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ",message);
//   }
// });

//  get the count of the total rows
// db.count("users", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//      console.log("error. ",message);
//   }
// });

// search data
// db.search("users", "name", "Junaid", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//      console.log("error. ",message);
//   }
// });

// get a field values
// db.getFieldValues("users",  "name", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });

// search by field/key
// db.searchByField("users", "age", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ", message);
//   }
// });

// filter by condition

// simple condition
// db.filter("users", { age: 24 }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ", message);
//   }
// });

// // greater than condition
// db.filter("users",  {age: { $gt: 20 }}, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {

//     console.log("error. ",message);
//   }
// });

// update one object
// db.updateOne("users", { age: 24 }, { age: 25 }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ", message);
//   }
// });

// Example usage:
// db.updateMany("users", { age: 32 }, { age: 25 }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("Error. ", message);
//   }
// });

// delete one
// db.deleteOne("users", { name: "Sulman" }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ", message);
//   }
// });

// delete one
// db.deleteMany("users", { name: "Junaid" }, (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ", message);
//   }
// });

// clear collection
// db.clearCollection("users", (success, data, message) => {
//   if (success) {
//     console.log(data);
//   } else {
//     console.log("error. ", message);
//   }
// });

// delete collection
// db.deleteCollection("users", (success, data, message) => {
//   if (success) {
//     console.log(data, message);
//   } else {
//     console.log("error. ", message);
//   }
// });
