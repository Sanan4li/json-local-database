const path = require("path");
const fs = require("fs");
const { messages } = require("./constants");

// Default location of the database
const defaultLocation = path.join("local-db");



/**
 * Create a collection | a json file
 * The second argument is optional, if omitted, the file
 * will be created at the default location.
 * @param {string} collectionName - Collection name
 * @param {function} callback - Callback function
 */
function createCollection(collectionName, callback) {
  // Check if directory exist, create if not
  
  if (!fs.existsSync(defaultLocation)) {
     fs.mkdirSync(defaultLocation);
  }

  const fname = path.join(defaultLocation, collectionName + ".json");


  // Check if the file with the Collection name.json exists
  const exists = fs.existsSync(fname);

  if (exists) {
    callback(false, `${collectionName} ${messages.COLLECTION_EXISTS}`);
    return;
  }

  // Create an empty object and pass an empty array as value
  const obj = { [collectionName]: [] };

  // Write the object to json file
  try {
    fs.writeFileSync(fname, JSON.stringify(obj, null, 2));
    callback(true, `${collectionName} ${messages.COLLECTION_CREATED}`);
  } catch (e) {
    callback(false, e.toString());
  }
}




/**
 * Checks if a json file contains valid JSON string
 * @param {string} dbName - Database name
 * @returns {boolean} - True if valid, false otherwise
 */
function valid(dbName) {
  const fName = path.join(defaultLocation, dbName + ".json");

  try {
    const content = fs.readFileSync(fName, "utf-8");
    JSON.parse(content);
    return true;
  } catch (e) {
    return false;
  }
}



/**
 * Insert object to collection. The object will be appended with the property, id
 * which uses timestamp as value.
 * There are 3 required arguments.
 * @param {string} collectionName - Collection name
 * @param {string} data - data object
 * @param {Function} callback - Callback function
 * @returns {(number|undefined)} - ID of the inserted data
 */
function insertOne(collectionName, data, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    // collection | json parsed
    const collection = JSON.parse(fs.readFileSync(fname));

    const date = new Date();
    const id = date.getTime();
    data["id"] = id;

    collection[collectionName].push(data);

    try {
      fs.writeFileSync(fname, JSON.stringify(collection, null, 2));
      callback(true, data, messages.SAVE_SUCCESS_MESSAGE);
      return id;
    } catch (e) {
      callback(false, null,  messages.SAVE_ERROR_MESSAGE);
      return;
    }
  }

  callback(false, null,  messages.COLLECTION_NOT_EXISTS);
  return;
}






/**
 * Insert objects to collection. Each object will be appended with the property 'id',
 * which uses timestamp as value.
 * There are 3 required arguments.
 * @param {string} collectionName - Collection name
 * @param {Array} data - Array of row objects
 * @param {Function} callback - Callback function
 * @returns {Array} - Array of IDs of the inserted data
 */
function insertMany(collectionName, data, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    // collection | json parsed
    const collection = JSON.parse(fs.readFileSync(fname));

    const insertedIds = [];

    data.forEach((data) => {
      const date = new Date();
      const id = date.getTime();
      data["id"] = id;
      collection[collectionName].push(data);
      insertedIds.push(id);
    });

    try {
      fs.writeFileSync(fname, JSON.stringify(collection, null, 2));
      callback(true, data, messages.SAVE_SUCCESS_MESSAGE);
      return insertedIds;
    } catch (e) {
      callback(false, null,  messages.SAVE_ERROR_MESSAGE);
      return;
    }
  }

  callback(false, null, `${collectionName} ${messages.COLLECTION_NOT_EXISTS}`);
  return;
}



/**
 * Get all contents of the collection/json file object
 * @param {string} collectionName - Collection name
 * @param {Function} callback - Callback function
 */
function getAll(collectionName, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const collection = JSON.parse(fs.readFileSync(fname));
      callback(true, collection[collectionName], null);
      return;
    } catch (e) {
      callback(false, [], e);
      return;
    }
  } else {
    callback(false, null,  `${collectionName} ${messages.COLLECTION_NOT_EXISTS}`);
    return;
  }
}




/**
 * Count the number of rows for a given collection.
 * @param {string} collectionName - Collection name
 * @param {Function} callback - Function callback
 */
function count(collectionName, callback) {
  getAll(collectionName, (success, data, message) => {
    if (success) {
      callback(true, data.length, "Record found!");
      return;
    } else {
      callback(false, data, message);
      return;
    }
  });

}




/**
 * Searching function
 * @param {string} collectionName - Name of the collection to search for
 * @param {string} field - Name of the column/key to match
 * @param {string} keyword - The part of the value of the key that is being looked up
 * @param {Function} callback - Callback function
 */
function search(collectionName, field, keyword, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const collection = JSON.parse(fs.readFileSync(fname));
      const rows = collection[collectionName];

      const foundRows = rows.filter(
        (row) =>
          row.hasOwnProperty(field) &&
          row[field]
            .toString()
            .toLowerCase()
            .includes(keyword.toString().toLowerCase())
      );

      callback(true, foundRows, null);
      return;
    } catch (e) {
      callback(false, e.toString(), messages.SOMETHING_WENT_WRONG);
      return;
    }
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}





/**
 * Find rows of a given field/key.
 * @param {string} collectionName - Collection name
 * @param {string} key - The key/field to retrieve.
 * @param {Function} callback - Callback function
 */
function getFieldValues(collectionName, key, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    const collection = JSON.parse(fs.readFileSync(fname));
    const rows = collection[collectionName];
    const data = [];

    let hasMatch = false;

    for (const row of rows) {
      if (row.hasOwnProperty(key)) {
        data.push(row[key]);
        hasMatch = true;
      }
    }

    if (!hasMatch) {
      callback(false, null, messages.KEY_NOT_EXIST);
      return;
    }

    callback(true, data, null);
    return;
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}





/**
 * Find rows of a given field/key.
 * @param {string} collectionName - Collection name
 * @param {string} key - The key/field to retrieve.
 * @param {Function} callback - Callback function
 */
function searchByField(collectionName, key, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    const collection = JSON.parse(fs.readFileSync(fname));
    const rows = collection[collectionName];
    const data = [];

    let hasMatch = false;

    for (const row of rows) {
      if (row.hasOwnProperty(key)) {
        data.push(row);
        hasMatch = true;
      }
    }

    if (!hasMatch) {
      callback(false, null, messages.KEY_NOT_EXIST);
      return;
    }

    callback(true, data, null);
    return;
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}





/**
 * Get row or rows that matched the given condition(s) in WHERE argument
 * @param {string} collectionName - Collection name
 * @param {object} where - Collection of conditions to be met
 * @param {Function} callback - Function callback
 */
function filter(collectionName, where, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const collection = JSON.parse(fs.readFileSync(fname));
      const rows = collection[collectionName];

      const objs = rows.filter((row) =>
        Object.entries(where).every(([key, value]) => {
          // Handle special operators like $gt (greater than) and $lt (less than)
          if (typeof value === 'object') {
            if (value.hasOwnProperty('$gt')) {
              return row[key] > value['$gt'];
            } else if (value.hasOwnProperty('$lt')) {
              return row[key] < value['$lt'];
            }
          }
          // Add more condition handlers for other operators if needed

          // Default: Equality check
          return row[key] === value;
        })
      );

      callback(true, objs, null);
      return;
    } catch (e) {
      callback(false, null, e.toString());
      return;
    }
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}





/**
 * Update a row or record which satisfies the where clause
 * @param {string} collectionName - Collection name
 * @param {object} where - Object for WHERE clause
 * @param {object} set - Object for SET clause
 * @param {Function} callback - Callback function
 */
function update(collectionName, where, set, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const collection = JSON.parse(fs.readFileSync(fname));
      const rows = collection[collectionName];

      const matchedRow = rows.find((row) =>
        Object.entries(where).every(([key, value]) => row[key] === value)
      );

      if (matchedRow) {
       const updatedObject =  Object.assign(matchedRow, set);

        fs.writeFileSync(fname, JSON.stringify(collection, null, 2), (err) => {});
        callback(true, updatedObject, messages.UPDATED_SUCCESSFULLY);
        return;
      } else {
        callback(false, messages.RECORD_NOT_FOUND);
        return;
      }
    } catch (e) {
      callback(false, e.toString());
      return;
    }
  } else {
    callback(false, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}






/**
 * Delete a row specified.
 * @param {string} collectionName - Collection name
 * @param {object} where - Object specifying the conditions for deletion
 * @param {Function} callback - Callback function
 */
function deleteOne(collectionName, where, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const collection = JSON.parse(fs.readFileSync(fname));
      const rows = collection[collectionName];
      const rowToDelete = rows.find((row) => {
        return Object.entries(where).every(([key, value]) => row[key] === value);
      })
      const updatedRows = rows.filter(
        (row) =>
          !Object.entries(where).every(([key, value]) => row[key] === value)
      );
      
      if (updatedRows.length === rows.length) {
        callback(false, null, messages.RECORD_NOT_FOUND);
        return;
      }

      collection[collectionName] = updatedRows;
      
      fs.writeFileSync(fname, JSON.stringify(collection, null, 2), (err) => {});
      callback(true, rowToDelete, messages.RECORD_DELETED);
      return;
    } catch (e) {
      callback(false, null, e.toString());
      return;
    }
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}




/**
 * Delete multiple rows specified.
 * @param {string} collectionName - Collection name
 * @param {object} conditions - Object specifying the conditions for deletion
 * @param {Function} callback - Callback function
 */
function deleteMany(collectionName, conditions, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const collection = JSON.parse(fs.readFileSync(fname));
      const rows = collection[collectionName];

      const matchedIndices = rows.reduce((indices, row, index) => {
        const isMatched = Object.entries(conditions).every(
          ([key, value]) => row.hasOwnProperty(key) && row[key] === value
        );

        if (isMatched) {
          indices.push(index);
        }

        return indices;
      }, []);


      const matchedRows = rows.filter((row) =>
        Object.entries(conditions).every(
          ([key, value]) => row.hasOwnProperty(key) && row[key] === value
        )
      );


      if (matchedIndices.length === 0) {
        callback(false, messages.RECORD_NOT_FOUND);
        return;
      }

      for (let k = matchedIndices.length - 1; k >= 0; k--) {
        rows.splice(matchedIndices[k], 1);
      }

      // Update the existing collection with the modified rows
      collection[collectionName] = rows;

      // Write the object to json file
      fs.writeFileSync(fname, JSON.stringify(collection, null, 2), (err) => {});

      callback(true, matchedRows,  messages.RECORD_DELETED);
      return;
    } catch (e) {
      callback(false, null, e.toString());
      return;
    }
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}



/**
 * Check collection existence
 * @param {string} dbName - Collection name
 * @return {boolean} - Result of existence check
 */
function exists(dbName, defaultLocation) {
  const fName = path.join(defaultLocation, dbName + ".json");
  return fs.existsSync(fName);
}






/**
 * Clears an existing table leaving an empty list in the json file.
 * @param {string} tableName - Table name
 * @param {Function} callback - Callback function
 */
function clearCollection(tableName, callback) {
  const fname = path.join(defaultLocation, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    const obj = { [tableName]: [] };

    // Write the object to json file
    try {
      fs.writeFileSync(fname, JSON.stringify(obj, null, 2));
      callback(true,[],  messages.RECORD_DELETED);
      return;
    } catch (e) {
      callback(false, null, e.toString());
      return;
    }
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}




/**  delete an existing collection/json file 
* @param {string} collectionName - Collection name
* @param {Function} callback - Callback function
*/

function deleteCollection(collectionName, callback) {
  const fname = path.join(defaultLocation, collectionName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      fs.unlinkSync(fname);
      callback(true, null, messages.COLLECTION_DELETED);
      return;
    } catch (e) {
      callback(false, null, e.toString());
      return;
    }
  } else {
    callback(false, null, messages.COLLECTION_NOT_EXISTS);
    return;
  }
}







// Export the public available functions
module.exports = {
  createCollection,
  insertOne,
  insertMany,
  getAll,
  filter,
  update,
  searchByField,
  search,
  deleteOne,
  deleteMany,
  valid,
  getFieldValues,
  count,
  exists,
  clearCollection,
  deleteCollection
};
