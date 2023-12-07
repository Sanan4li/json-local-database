// const electron = require('electron');
const path = require("path");
const fs = require("fs");
const os = require("os");

var pack = null;
try {
  pack = require("../../package.json");
} catch (e) {}

const platform = os.platform();

var appName = "";
if (pack !== null) {
  appName = pack.productName ? pack.productName : pack.name;
}

let userData = "";

if (platform === "win32") {
  userData = path.join(process.env.APPDATA, appName);
} else if (platform === "darwin") {
  userData = path.join(
    process.env.HOME,
    "Library",
    "Application Support",
    appName
  );
} else {
  userData = path.join("var", "local", appName);
}

const defaultLocation = path.join(userData, "database");

/**
 * Create a table | a json file
 * The second argument is optional, if ommitted, the file
 * will be created at the default location.
 * @param  {[string]} arguments[0] [Table name]
 * @param {[function]} arguments[1] [Callback ]
 */
function createTable() {
  const tableName = arguments[0];
  const fname = path.join(defaultLocation, tableName + ".json");
  const callback = arguments[1];

  // Check if the file with the tablename.json exists
  let exists = fs.existsSync(fname);

  if (exists) {
    // The file exists, do not recreate the table/json file
    callback(false, tableName + ".json already exists!");
    return;
  } else {
    // Create an empty object and pass an empty array as value
    let obj = new Object();
    obj[tableName] = [];

    // Write the object to json file
    try {
      fs.writeFileSync(fname, JSON.stringify(obj, null, 2), (err) => {});
      callback(true, "Success!");
      return;
    } catch (e) {
      callback(false, e.toString());
      return;
    }
  }
}

/**
 * Checks if a json file contains valid JSON string
 */
function valid() {
  const dbName = arguments[0];
  var fName = path.join(defaultLocation, dbName + ".json");
  const content = fs.readFileSync(fName, "utf-8");
  try {
    JSON.parse(content);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Insert objects to table. Each object will be appended with the property 'id',
 * which uses timestamp as value.
 * There are 3 required arguments.
 * @param  {string} arguments[0]  [Table name]
 * @param  {Array} arguments[1] [Array of row objects]
 * @param  {Function} arguments[2] [Callback function]
 * @returns {Array} [Array of IDs of the inserted rows]
 */
function insertMany() {
  let fname = path.join(userData, arguments[0] + ".json");
  var callback;
  var tableRows;

  tableRows = arguments[1];
  callback = arguments[2];

  let exists = fs.existsSync(fname);

  if (exists) {
    // Table | json parsed
    let table = JSON.parse(fs.readFileSync(fname));

    let insertedIds = [];

    tableRows.forEach((tableRow) => {
      let date = new Date();
      let id = date.getTime();
      tableRow["id"] = id;
      table[tableName].push(tableRow);
      insertedIds.push(id);
    });

    try {
      fs.writeFileSync(fname, JSON.stringify(table, null, 2), (err) => {});

      callback(true, "Objects written successfully!");
      return insertedIds;
    } catch (e) {
      callback(false, "Error writing objects.");
      return;
    }
  }

  callback(false, "Table/json file doesn't exist!");
  return;
}

/**
 * Insert object to table. The object will be appended with the property, id
 * which uses timestamp as value.
 * There are 3 required arguments.
 * @param  {string} arguments[0]  [Table name]
 * @param  {string} arguments[1] [Row object]
 * @param  {Function} arguments[2] [Callback function]
 * @returns {(number|undefined)} [ID of the inserted row]
 */

// function to insert one object (tableName, tableRow, callback) {
function insertOne() {
  let tableName = arguments[0];
  let tableRow = arguments[1];
  let callback = arguments[2];
  var fname = path.join(userData, arguments[0] + ".json");

  let exists = fs.existsSync(fname);

  if (exists) {
    // Table | json parsed
    let table = JSON.parse(fs.readFileSync(fname));

    let date = new Date();
    let id = date.getTime();
    tableRow["id"] = id;

    table[tableName].push(tableRow);

    try {
      fs.writeFileSync(fname, JSON.stringify(table, null, 2), (err) => {});

      callback(true, "Object written successfully!");
      return id;
    } catch (e) {
      callback(false, "Error writing object.");
      return;
    }
  }
  callback(false, "Table/json file doesn't exist!");
  return;
}

/**
 * Get all contents of the table/json file object
 * @param  {string} arguments[0] [Table name]
 * @param  {Function} arguments[1]  [callback function]
 */
// function getAll(tableName, callback) {
function getAll() {
  var fname = "";
  var callback;
  var tableName = arguments[0];

  fname = path.join(userData, tableName + ".json");
  callback = arguments[1];

  let exists = fs.existsSync(fname);

  if (exists) {
    try {
      let table = JSON.parse(fs.readFileSync(fname));
      callback(true, table[tableName]);
      return;
    } catch (e) {
      callback(false, []);
      return;
    }
  } else {
    callback(false, "Table file does not exist!");
    return;
  }
}

/**
 * Find rows of a given field/key.
 * @param  {string} arguments[0] Table name
 * @param  {string} arguments[1] They fey/field to retrieve.
 */
function getFieldValues() {
  let fname = "";
  let tableName = arguments[0];
  let callback;
  let key;

  fname = path.join(userData, tableName + ".json");
  callback = arguments[2];
  key = arguments[1];

  let exists = fs.existsSync(fname);

  if (exists) {
    let table = JSON.parse(fs.readFileSync(fname));
    const rows = table[tableName];
    let data = [];

    let hasMatch = false;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].hasOwnProperty(key)) {
        data.push(rows[i][key]);
        hasMatch = true;
      }
    }

    if (!hasMatch) {
      callback(false, "The key/field given does not exist.");
      return;
    }

    callback(true, data);
    return;
  } else {
    callback(false, "The table you are trying to access does not exist.");
    return;
  }
}

/**
 * Find rows of a given field/key.
 * @param  {string} arguments[0] Table name
 * @param  {string} arguments[1] They fey/field to retrieve.
 */
function searchByField() {
  let fname = "";
  let tableName = arguments[0];
  let callback;
  let key;

  fname = path.join(userData, tableName + ".json");
  callback = arguments[2];
  key = arguments[1];

  let exists = fs.existsSync(fname);

  if (exists) {
    let table = JSON.parse(fs.readFileSync(fname));
    const rows = table[tableName];
    let data = [];

    let hasMatch = false;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].hasOwnProperty(key)) {
        data.push(rows[i]);
        hasMatch = true;
      }
    }

    if (!hasMatch) {
      callback(false, "The key/field given does not exist.");
      return;
    }

    callback(true, data);
    return;
  } else {
    callback(false, "The table you are trying to access does not exist.");
    return;
  }
}

/**
 * Clears an existing table leaving an empty list in the json file.
 * @param  {string} arguments[0] [Table name]
 * @param  {Function} arguments[1]  [callback function]
 */
function clearTable() {
  let fname = "";
  let tableName = arguments[0];
  let callback;

  fname = path.join(userData, tableName + ".json");
  callback = arguments[1];

  let exists = fs.existsSync(fname);

  if (exists) {
    let obj = new Object();
    obj[tableName] = [];

    // Write the object to json file
    try {
      fs.writeFileSync(fname, JSON.stringify(obj, null, 2), (err) => {});
      callback(true, "Table cleared successfully!");
      return;
    } catch (e) {
      callback(false, e.toString());
      return;
    }
  } else {
    callback(false, "The table you are trying to clear does not exist.");
    return;
  }
}

/**
 * Count the number of rows for a given table.
 * @param {string} FirstArgument Table name
 * @param {callback} SecondArgument Function callback
 */
function count() {
  let tableName = arguments[0];
  let callback;
  callback = arguments[1];
  getAll(tableName, (succ, data) => {
    if (succ) {
      callback(true, data.length);
      return;
    } else {
      callback(false, data);
      return;
    }
  });

  callback(
    false,
    "Wrong number of arguments. Must be either 2 or 3 arguments including callback function."
  );
  return;
}

/**
 * Get row or rows that matched the given condition(s) in WHERE argument
 * @param {string} FirstArgument Table name
 * @param {object} SecondArgument Collection of conditions to be met
 ```
 {
      key1: value1,
      key2: value2,
      ...
 }
 ```
 * @param {callback} ThirdArgument Function callback
 */
function filter() {
  let tableName = arguments[0];
  var fname = "";
  var callback;
  var where;

  fname = path.join(userData, tableName + ".json");
  where = arguments[1];
  callback = arguments[2];

  let exists = fs.existsSync(fname);
  let whereKeys;

  // Check if where is an object
  if (Object.prototype.toString.call(where) === "[object Object]") {
    // Check for number of keys
    whereKeys = Object.keys(where);
    if (whereKeys === 0) {
      callback(false, "There are no conditions passed to the WHERE clause.");
      return;
    }
  } else {
    callback(false, "WHERE clause should be an object.");
    return;
  }

  // Check if the json file exists, if it is, parse it.
  if (exists) {
    try {
      let table = JSON.parse(fs.readFileSync(fname));
      let rows = table[tableName];

      let objs = [];

      for (let i = 0; i < rows.length; i++) {
        let matched = 0; // Number of matched complete where clause
        for (var j = 0; j < whereKeys.length; j++) {
          // Test if there is a matched key with where clause
          if (rows[i].hasOwnProperty(whereKeys[j])) {
            if (rows[i][whereKeys[j]] === where[whereKeys[j]]) {
              matched++;
            }
          }
        }

        // Check if all conditions in the WHERE clause are matched
        if (matched === whereKeys.length) {
          objs.push(rows[i]);
        }
      }

      callback(true, objs);
      return;
    } catch (e) {
      callback(false, e.toString());
      return;
    }
  } else {
    callback(false, "Table file does not exist!");
    return;
  }
}

/**
 * Update a row or record which satisfies the where clause
 * @param  {[string]} arguments[0] [Table name]
 * @param  {[object]} arguments[1]     [Objet for WHERE clause]
 * @param  {[object]} arguments[2]       [Object for SET clause]
 * @param  {Function} arguments[3]  [Callback function]
 */
// function updateRow(tableName, where, set, callback) {
function update() {
  let tableName = arguments[0];
  var fname = "";
  var where;
  var set;
  var callback;

  fname = path.join(userData, tableName + ".json");
  where = arguments[1];
  set = arguments[2];
  callback = arguments[3];

  let exists = fs.existsSync(fname);

  let whereKeys = Object.keys(where);
  let setKeys = Object.keys(set);

  if (exists) {
    let table = JSON.parse(fs.readFileSync(fname));
    let rows = table[tableName];

    let matched = 0; // Number of matched complete where clause
    let matchedIndex = 0;

    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < whereKeys.length; j++) {
        // Test if there is a matched key with where clause and single row of table
        if (rows[i].hasOwnProperty(whereKeys[j])) {
          if (rows[i][whereKeys[j]] === where[whereKeys[j]]) {
            matched++;
            matchedIndex = i;
          }
        }
      }
    }

    if (matched === whereKeys.length) {
      // All field from where clause are present in this particular
      // row of the database table
      try {
        for (var k = 0; k < setKeys.length; k++) {
          // rows[i][setKeys[k]] = set[setKeys[k]];
          rows[matchedIndex][setKeys[k]] = set[setKeys[k]];
        }

        // Create a new object and pass the rows
        let obj = new Object();
        obj[tableName] = rows;

        // Write the object to json file
        try {
          fs.writeFileSync(fname, JSON.stringify(obj, null, 2), (err) => {});

          callback(true, "Success!");
          return;
        } catch (e) {
          callback(false, e.toString());
          return;
        }

        callback(true, rows);
      } catch (e) {
        callback(false, e.toString());
        return;
      }
    } else {
      callback(false, "Cannot find the specified record.");
      return;
    }
  } else {
    callback(false, "Table file does not exist!");
    return;
  }
}

/**
 * Searching function
 * @param {string} arguments[0] Name of the table to search for
 * @param {string} arguments[1] Name of the column/key to match
 * @param {object} arguments[2] The part of the value of the key that is being lookup
 * @param {function} arguments[3] Callback function
 */
// function search(tableName, field, keyword, callback) {
function search() {
  let tableName = arguments[0];
  var fname = "";
  var field;
  var keyword;
  var callback;

  fname = path.join(userData, tableName + ".json");
  field = arguments[1];
  keyword = arguments[2];
  callback = arguments[3];

  let exists = fs.existsSync(fname);

  if (exists) {
    let table = JSON.parse(fs.readFileSync(fname));
    let rows = table[tableName];

    if (rows.length > 0) {
      // Declare an empty list
      let foundRows = [];

      for (var i = 0; i < rows.length; i++) {
        // Check if key exists
        if (rows[i].hasOwnProperty(field)) {
          // Make sure that an object is converted to string before
          // applying toLowerCase()
          let value = rows[i][field].toString().toLowerCase();
          let n = value.search(keyword.toString().toLowerCase());

          if (n !== -1) {
            // The substring is found, add object to the list.
            foundRows.push(rows[i]);
          }
        } else {
          callback(false, 2);
          return;
        }
      }

      callback(true, foundRows);
      return;
    } else {
      callback(false, []);
      return;
    }
  } else {
    callback(false, "Table file does not exist!");
    return;
  }
}

/**
 * Delete a row specified.
 * @param {*} tableName
 * @param {*} where
 * @param {*} callback
 */
// function deleteRow(tableName, where, callback) {
function deleteOne() {
  let tableName = arguments[0];

  var fname = "";
  var where;
  var callback;

  fname = path.join(userData, tableName + ".json");
  where = arguments[1];
  callback = arguments[2];

  let exists = fs.existsSync(fname);

  let whereKeys = Object.keys(where);

  if (exists) {
    let table = JSON.parse(fs.readFileSync(fname));
    let rows = table[tableName];

    if (rows.length > 0) {
      let matchedIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        // Iterate through the rows
        let isMatched = true;

        for (var j = 0; j < whereKeys.length; j++) {
          // Test if there is a matched key with where clause and single row of table
          if (
            !rows[i].hasOwnProperty(whereKeys[j]) ||
            rows[i][whereKeys[j]] !== where[whereKeys[j]]
          ) {
            isMatched = false;
            break;
          }
        }

        if (isMatched) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex === -1) {
        callback(false, "Row does not exist!");
        return;
      }

      rows.splice(matchedIndex, 1);

      // Create a new object and pass the rows
      let obj = new Object();
      obj[tableName] = rows;

      // Write the object to json file
      try {
        fs.writeFileSync(fname, JSON.stringify(obj, null, 2), (err) => {});
        callback(true, "Row deleted successfully!");
        return;
      } catch (e) {
        callback(false, e.toString());
        return;
      }
    } else {
      callback(false, "Table is empty!");
      return;
    }
  } else {
    callback(false, "Table file does not exist!");
    return;
  }
}

/**
 * Delete multiple rows specified.
 * @param {*} tableName
 * @param {*} where
 * @param {*} callback
 */
// function deleteRow(tableName, where, callback) {
function deleteMany() {
  let tableName = arguments[0];

  var fname = "";
  var conditions;
  var callback;

  fname = path.join(userData, tableName + ".json");
  conditions = arguments[1];
  callback = arguments[2];

  let exists = fs.existsSync(fname);

  if (exists) {
    let table = JSON.parse(fs.readFileSync(fname));
    let rows = table[tableName];

    if (rows.length > 0) {
      let matchedIndices = [];

      for (let i = 0; i < rows.length; i++) {
        let isMatched = true;

        for (let conditionKey in conditions) {
          if (
            !rows[i].hasOwnProperty(conditionKey) ||
            rows[i][conditionKey] !== conditions[conditionKey]
          ) {
            isMatched = false;
            break;
          }
        }

        if (isMatched) {
          matchedIndices.push(i);
        }
      }

      if (matchedIndices.length === 0) {
        callback(false, "No matching rows found!");
        return;
      }

      for (let k = matchedIndices.length - 1; k >= 0; k--) {
        rows.splice(matchedIndices[k], 1);
      }

      // Create a new object and pass the rows
      let obj = new Object();
      obj[tableName] = rows;

      // Write the object to json file
      try {
        fs.writeFileSync(fname, JSON.stringify(obj, null, 2), (err) => {});
        callback(true, "Rows deleted successfully!");
        return;
      } catch (e) {
        callback(false, e.toString());
        return;
      }
    } else {
      callback(false, "Table is empty!");
      return;
    }
  } else {
    callback(false, "Table file does not exist!");
    return;
  }
}

/**
 * Check table existence
 * @param {String} dbName - Table name
 * @return {Boolean} checking result
 */
function exists() {
  let fName = "";
  // Given the database name and location
  let dbName = arguments[0];
  let dbLocation = arguments[1];
  fName = path.join(dbLocation, dbName + ".json");

  return fs.existsSync(fName);
}

// Export the public available functions
module.exports = {
  createTable,
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
  clearTable,
  getFieldValues,
  count,
  exists,
};
