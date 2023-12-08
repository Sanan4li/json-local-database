# json-local-db
---

**json-local-db** JSON local database is like mongoDB database. It's a simple local database that uses JSON files as collections. A perfect solution of electron/node apps that needs a local database..

This package creates a JSON file for each collection inside the application's `json-local-db` folder. The `json-local-db` folder is created when you create your first collection.

### **Installation**
The preferred way of installation is to install it locally on the application.
```javascript
npm install json-local-db --save
```
---
### **Using json-local-db**
After installing the package, you can now use it in your application. To use it, just require it in your application. 

```javascript
const db = require('json-local-db');
```
---
### **Creating a collection**

The function `createCollection()` creates a json file `[collection].json` inside the application `json-local-db` folder. It will return an error if the collection/json file is already created.
```javascript
db.createCollection(dbName, callback(success, message)=>{});
```
#### Example

```javascript

const db = require('json-local-db');

db.createCollection("users", (success, message) => {
    if (success) {
        console.log(message);
    } else {
        console.log("error. ",message);
    }
});

/*
	Output:
    	Success: true
        Message: Success or error message

	Result file (users.json):
        Inside the file : 
          {
            "users": []
          }
*/

```
---

### **Inserting Single Object to a Collection**

The function `db.insertOne()` insert an object into the array of the collection.
```javascript
db.insertOne(collectionName, { name: "Sanan", age: 24 }, (success, data, message) => {});
```
#### Example

To insert an object to the collection, use the `insertOne()` function. The function accepts 3 parameters, the collection name, the object to be inserted and the callback function.


```javascript
db.insertOne("users", { name: "Sanan", age: 24 }, (success, data, message) => {
  if (success) {
    console.log(data);
  }
  else{
     console.log("error. ",message);
  }
});

/*
	Output:
    	Success: true
        data: { name: 'Sanan', age: 24, id: 1702051713569 }
        Message: Error message if any

*/
```
---

### **Inserting an Array of Objects to a Collection**

The function `db.insertMany()` insert an object into the array of the collection.
```javascript
db.insertOne(collectionName, { name: "Sanan", age: 24 }, (success, data, message) => {});
```
#### Example

To insert multiple objects to the collection, use the `insertMany()` function. The function accepts 3 parameters, the collection name, the array of objects to be inserted and the callback function.


```javascript
db.insertMany("users", [{ name: "Sanan", age: 24 }, { name: "Junaid", age: 32}], (success, data, message) => {
  if (success) {
    console.log(data);
  }
  else{
     console.log("error. ",message);
  }
});

/*
	Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
                { name: 'Junaid', age: 32, id: 1702052585609 },
              ]

        Message: Error message if any

*/
```
---

### **Getting All Saved Objects from a Collection**
The function `db.getAll()` finds all the saved objects from the collection and returns in an array.
```javascript
db.getAll(collectionName, (success, data, message) => {});
```
#### Example

To get all the data from the collection, use the `getAll()` function. The function accepts 2 parameters, the collection name and the callback function.

```javascript
db.getAll("users", (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ",message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
                { name: 'Junaid', age: 32, id: 1702052585609 },
              ]
        Message: Error message if any

*/
```
---
### **Getting Count of Saved Objects**
The function `db.count()` finds the count of all the saved objects from the collection and returns the count.
```javascript
db.count(collectionName, (success, data, message) => {});
```
#### Example

To get the count of all the data from the collection, use the `count()` function. The function accepts 2 parameters, the collection name and the callback function.

```javascript
db.count("users", (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ",message);
  }
});

/*
  Output:
    	Success: true
        data: 2
        Message: Error message if any

*/
```
---

### **Search in a Collection**
The function `db.search()` finds the saved objects from the collection that matches the search query and returns in an array.
```javascript
db.search("users", key, value, , (success, data, message) => {});
```

#### Example

To search in the collection, use the `db.search()` function. The function accepts 4 parameters, the collection name, key, value and the callback function.

```javascript
db.search("users",  "name", "Sanan" , (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ",message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
              ]
        Message: Error message if any

*/
```
### **Get Values of a Key in a Collection**

The function `db.getFieldValues()` finds the values of a key in the collection and returns in an array.
```javascript
db.getFieldValues("users", key, (success, data, message) => {});
```

#### Example

To get the values of a key in the collection, use the `db.getFieldValues()` function. The function accepts 3 parameters, the collection name, key and the callback function.

```javascript
db.getFieldValues("users",  "name" , (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ",message);
  }
});

/*
  Output:
    	Success: true
        data: [
                "Sanan",
                "Junaid"
              ]
        Message: Error message if any

*/
```






For contributions, please see the `CONTRIBUTE.md` file. Thank you.
