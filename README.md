# json-local-database

**json-local-database** JSON local database is like mongoDB database. It's a simple local database that uses JSON files as collections. A perfect solution of electron/node apps that needs a local database..

This package creates a JSON file for each collection inside the application's `json-local-database` folder. The `json-local-database` folder is created when you create your first collection.

---

**Table of Contents:**

- [Installation](#installation)
- [Using json-local-database](#using-json-local-database)
- [Creating a collection](#creating-a-collection)
- [Inserting Single Object to a Collection](#inserting-single-object-to-a-collection)
- [Inserting an Array of Objects to a Collection](#inserting-an-array-of-objects-to-a-collection)
- [Getting All Saved Objects from a Collection](#getting-all-saved-objects-from-a-collection)
- [Getting Count of Saved Objects](#getting-count-of-saved-objects)
- [Search in a Collection](#search-in-a-collection)
- [Get Values of a Key in a Collection](#get-values-of-a-key-in-a-collection)
- [Search by Field in a Collection](#search-by-field-in-a-collection)
- [Filter by Condition in a Collection](#filter-by-condition-in-a-collection)
- [Filter by Less Than or Greater Than Condition in a Collection](#filter-by-less-than-or-greater-than-condition-in-a-collection)
- [Update a Single Record Collection](#update-a-single-record-collection)
- [Update Multiple Records in a Collection](#update-multiple-records-in-a-collection)
- [Delete a Single Record in a Collection](#delete-a-single-record-in-a-collection)
- [Delete Multiple Records in a Collection](#delete-multiple-records-in-a-collection)
- [Clear a Collection](#clear-a-collection)
- [Delete a Collection](#delete-a-collection)
- [Contributions](#contributions)

---

### **Installation**

The preferred way of installation is to install it locally on the application.

```javascript
npm install json-local-database --save
```

---

### **Using json-local-database**

After installing the package, you can now use it in your application. To use it, just require it in your application.

```javascript
const db = require("json-local-database");
```

---

### **Creating a collection**

The function `createCollection()` creates a json file `[collection].json` inside the application `local-db` folder. It will return an error if the collection/json file is already created.

```javascript
db.createCollection(collectionName, callback(success, message)=>{});
```

#### Example

```javascript
const db = require("json-local-database");

db.createCollection("users", (success, message) => {
  if (success) {
    console.log(message);
  } else {
    console.log("error. ", message);
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
db.insertOne(
  collectionName,
  { name: "Sanan", age: 24 },
  (success, data, message) => {}
);
```

#### Example

To insert an object to the collection, use the `insertOne()` function. The function accepts 3 parameters, the collection name, the object to be inserted and the callback function.

```javascript
db.insertOne("users", { name: "Sanan", age: 24 }, (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
	Output:
    	Success: true
        data: { name: 'Sanan', age: 24, id: 1702051713569 }
        Message: Success or Error Message if any

*/
```

---

### **Inserting an Array of Objects to a Collection**

The function `db.insertMany()` insert an array of object into the specified collection.

```javascript
db.insertOne(
  collectionName,
  [
    { name: "Sanan", age: 24 },
    { name: "Junaid", age: 32 },
  ],
  (success, data, message) => {}
);
```

#### Example

To insert multiple objects to the collection, use the `insertMany()` function. The function accepts 3 parameters, the collection name, the array of objects to be inserted and the callback function.

```javascript
db.insertMany(
  "users",
  [
    { name: "Sanan", age: 24 },
    { name: "Junaid", age: 32 },
  ],
  (success, data, message) => {
    if (success) {
      console.log(data);
    } else {
      console.log("error. ", message);
    }
  }
);

/*
	Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
                { name: 'Junaid', age: 32, id: 1702052585609 },
              ]

        Message: Success or Error Message if any

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
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
                { name: 'Junaid', age: 32, id: 1702052585609 },
              ]
        Message: Success or Error Message if any

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
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: 2
        Message: Success or Error Message if any

*/
```

---

### **Search in a Collection**

The function `db.search()` finds the saved objects from the collection that matches the search query and returns in an array.

```javascript
db.search(collectionName, key, value, , (success, data, message) => {});
```

#### Example

To search in the collection, use the `db.search()` function. The function accepts 4 parameters, the collection name, key, value and the callback function.

```javascript
db.search("users", "name", "Sanan", (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
              ]
        Message: Success or Error Message if any

*/
```

### **Get Values of a Key in a Collection**

The function `db.getFieldValues()` finds the values of a key in the collection and returns in an array.

```javascript
db.getFieldValues(collectionName, key, (success, data, message) => {});
```

#### Example

To get the values of a key in the collection, use the `db.getFieldValues()` function. The function accepts 3 parameters, the collection name, key and the callback function.

```javascript
db.getFieldValues("users", "name", (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: [
                "Sanan",
                "Junaid"
              ]
        Message: Success or Error Message if any

*/
```

---

### **Search by Field in a Collection**

The function `db.searchByField()` finds the saved objects from the collection having the key and returns in an array of matched objects.

```javascript
db.searchByField(collectionName, key, (success, data, message) => {});
```

#### Example

To search by field in the collection, use the `db.searchByField()` function. The function accepts 3 parameters, the collection name, key and the callback function.

```javascript
db.searchByField("users", "name", (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
                { name: 'Junaid', age: 32, id: 1702052585609 },
              ]
        Message: Success or Error Message if any

*/
```

---

### **Filter by Condition in a Collection**

The function `db.filter()` finds the saved objects from the collection having the key and returns in an array of matched objects.

```javascript
db.filter(collectionName, condition, (success, data, message) => {});
```

#### Example

To filter by condition in the collection, use the `db.filter()` function. The function accepts 3 parameters, the collection name, condition and the callback function.

```javascript
db.filter("users", { name: "Sanan" }, (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Sanan', age: 24, id: 1702052585609 },
              ]
        Message: Success or Error Message if any

*/
```

---

### **Filter by Less Than or Greater Than Condition in a Collection**

The function `db.filter()` also finds the saved objects with less than or greater than condition from the collection and returns in an array of matched objects.

```javascript
db.filter(collectionName, condition, (success, data, message) => {});
```

#### Example

To filter by less than or greater than condition in the collection, use the `db.filter()` function. The function accepts 3 parameters, the collection name, condition and the callback function. The condition object should be in the format `{key: {$lt: value}}` or `{key: {$gt: value}}`.

```javascript
db.filter("users", { age: { $gt: 30 } }, (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data: [
                { name: 'Junaid', age: 32, id: 1702052585609 },
              ]
        Message: Success or Error Message if any

*/
```

### **Update a Single Record Collection**

The function `db.updateOne()` updates the saved objects from the collection that matches the search query and returns updated object.

```javascript
db.updateOne(collectionName, where, newValue, , (success, data, message) => {});
```

#### Example

To update in the collection, use the `db.update()` function. The function accepts 4 parameters, the collection name, where, newValue and the callback function.

```javascript
db.update(
  "users",
  { age: 24 }, // where
  { age: 25 }, // newValue
  (success, data, message) => {
    if (success) {
      console.log(data);
    } else {
      console.log("error. ", message);
    }
  }
);

/*
  Output:
    	Success: true
        data:   { name: 'Sanan', age: 25, id: 1702052585609 },
        Message: Success or Error Message if any

*/
```

---

### **Update Multiple Records in a Collection**

The function `db.updateMany()` updates the saved objects from the collection that matches the search query and returns updated array of object.

```javascript
db.updateMany(collectionName, where, newValue, , (success, data, message) => {});
```

#### Example

To update in the collection, use the `db.updateMany()` function. The function accepts 4 parameters, the collection name, where, newValue and the callback function.

```javascript
db.updateMany(
  "users",
  { age: 24 }, // where
  { age: 25 }, // newValue
  (success, data, message) => {
    if (success) {
      console.log(data);
    } else {
      console.log("error. ", message);
    }
  }
);

/*
  Output:
    	Success: true
        data:   [
                  { name: 'Sanan', age: 25, id: 1702052585609 },
                  { name: 'Junaid', age: 25, id: 1702052585609 },
                ]
        Message: Success or Error Message if any

*/
```

---

### **Delete a Single Record in a Collection**

The function `db.deleteOne()` deletes the saved objects from the collection that matches the search query and returns deleted object.

```javascript
db.deleteOne(collectionName, where, (success, data, message) => {});
```

#### Example

To delete in the collection, use the `db.deleteOne()` function. The function accepts 3 parameters, the collection name, where and the callback function.

```javascript
db.deleteOne(
  "users",
  { name: "Junaid" }, // where
  (success, data, message) => {
    if (success) {
      console.log(data);
    } else {
      console.log("error. ", message);
    }
  }
);

/*
  Output:
    	Success: true
        data:   { name: 'Sanan', age: 25, id: 1702052585609 },
        Message: Success or Error Message if any

*/
```

---

### **Delete Multiple Records in a Collection**

The function `db.deleteMany()` deletes the saved objects from the collection that matches the search query and returns deleted array of object.

```javascript
db.deleteMany(
  "users",
  { age: 25 }, // where
  (success, data, message) => {
    if (success) {
      console.log(data);
    } else {
      console.log("error. ", message);
    }
  }
);

/*
  Output:
    	Success: true
        data:   [
                  { name: 'Sanan', age: 25, id: 1702052585609 },
                  { name: 'Junaid', age: 25, id: 1702052585609 },
                ]
        Message: Success or Error Message if any

*/
```

---

### **Clear a Collection**

The function `db.clearCollection()` clears the collection and returns the empty array.

```javascript
db.clearCollection(collectionName, (success, data, message) => {});
```

#### Example

To clear the collection, use the `db.clearCollection()` function. The function accepts 2 parameters, the collection name and the callback function.

```javascript
db.clearCollection("users", (success, data, message) => {
  if (success) {
    console.log(data);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        data:   []
        Message: Success or Error Message if any

*/
```

---

### **Delete a Collection**

The function `db.deleteCollection()` deletes the collection and returns the success message. It deletes the physical file from the `json-local-database` folder.

```javascript
db.deleteCollection("users", (success, message) => {
  if (success) {
    console.log(message);
  } else {
    console.log("error. ", message);
  }
});

/*
  Output:
    	Success: true
        Message: Collection deleted successfully or Success or Error Message if any

*/
```

---

For contributions, please see the `CONTRIBUTE.md` file. Thank you.
