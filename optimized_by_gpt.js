const path = require("path");
const fs = require("fs");
const os = require("os");

let pack = null;
try {
  pack = require("../../package.json");
} catch (e) {}

const platform = os.platform();

let appName = "";
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
 * The second argument is optional, if omitted, the file
 * will be created at the default location.
 * @param {string} tableName - Table name
 * @param {function} callback - Callback function
 */
function createTable(tableName, callback) {
  const fname = path.join(defaultLocation, tableName + ".json");

  // Check if the file with the tablename.json exists
  const exists = fs.existsSync(fname);

  if (exists) {
    // The file exists, do not recreate the table/json file
    callback(false, `${tableName}.json already exists!`);
    return;
  }

  // Create an empty object and pass an empty array as value
  const obj = { [tableName]: [] };

  // Write the object to json file
  try {
    fs.writeFileSync(fname, JSON.stringify(obj, null, 2));
    callback(true, "Success!");
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
 * Insert objects to table. Each object will be appended with the property 'id',
 * which uses timestamp as value.
 * There are 3 required arguments.
 * @param {string} tableName - Table name
 * @param {Array} tableRows - Array of row objects
 * @param {Function} callback - Callback function
 * @returns {Array} - Array of IDs of the inserted rows
 */
function insertMany(tableName, tableRows, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    // Table | json parsed
    const table = JSON.parse(fs.readFileSync(fname));

    const insertedIds = [];

    tableRows.forEach((tableRow) => {
      const date = new Date();
      const id = date.getTime();
      tableRow["id"] = id;
      table[tableName].push(tableRow);
      insertedIds.push(id);
    });

    try {
      fs.writeFileSync(fname, JSON.stringify(table, null, 2));
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
 * @param {string} tableName - Table name
 * @param {string} tableRow - Row object
 * @param {Function} callback - Callback function
 * @returns {(number|undefined)} - ID of the inserted row
 */
function insertOne(tableName, tableRow, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    // Table | json parsed
    const table = JSON.parse(fs.readFileSync(fname));

    const date = new Date();
    const id = date.getTime();
    tableRow["id"] = id;

    table[tableName].push(tableRow);

    try {
      fs.writeFileSync(fname, JSON.stringify(table, null, 2));
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
 * @param {string} tableName - Table name
 * @param {Function} callback - Callback function
 */
function getAll(tableName, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const table = JSON.parse(fs.readFileSync(fname));
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
 * @param {string} tableName - Table name
 * @param {string} key - The key/field to retrieve.
 * @param {Function} callback - Callback function
 */
function getFieldValues(tableName, key, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    const table = JSON.parse(fs.readFileSync(fname));
    const rows = table[tableName];
    const data = [];

    let hasMatch = false;

    for (const row of rows) {
      if (row.hasOwnProperty(key)) {
        data.push(row[key]);
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
 * @param {string} tableName - Table name
 * @param {string} key - The key/field to retrieve.
 * @param {Function} callback - Callback function
 */
function searchByField(tableName, key, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    const table = JSON.parse(fs.readFileSync(fname));
    const rows = table[tableName];
    const data = [];

    let hasMatch = false;

    for (const row of rows) {
      if (row.hasOwnProperty(key)) {
        data.push(row);
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
 * @param {string} tableName - Table name
 * @param {Function} callback - Callback function
 */
function clearTable(tableName, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    const obj = { [tableName]: [] };

    // Write the object to json file
    try {
      fs.writeFileSync(fname, JSON.stringify(obj, null, 2));
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
 * @param {string} tableName - Table name
 * @param {Function} callback - Function callback
 */
function count(tableName, callback) {
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
    "Wrong number of arguments. Must be either 2 or 3 arguments including the callback function."
  );
  return;
}

/**
 * Get row or rows that matched the given condition(s) in WHERE argument
 * @param {string} tableName - Table name
 * @param {object} where - Collection of conditions to be met
 * @param {Function} callback - Function callback
 */
function filter(tableName, where, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const table = JSON.parse(fs.readFileSync(fname));
      const rows = table[tableName];

      const objs = rows.filter((row) =>
        Object.entries(where).every(([key, value]) => row[key] === value)
      );

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
 * @param {string} tableName - Table name
 * @param {object} where - Object for WHERE clause
 * @param {object} set - Object for SET clause
 * @param {Function} callback - Callback function
 */
function update(tableName, where, set, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const table = JSON.parse(fs.readFileSync(fname));
      const rows = table[tableName];

      const matchedRow = rows.find((row) =>
        Object.entries(where).every(([key, value]) => row[key] === value)
      );

      if (matchedRow) {
        Object.assign(matchedRow, set);

        fs.writeFileSync(fname, JSON.stringify(table, null, 2), (err) => {});
        callback(true, "Success!");
        return;
      } else {
        callback(false, "Cannot find the specified record.");
        return;
      }
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
 * Searching function
 * @param {string} tableName - Name of the table to search for
 * @param {string} field - Name of the column/key to match
 * @param {string} keyword - The part of the value of the key that is being looked up
 * @param {Function} callback - Callback function
 */
function search(tableName, field, keyword, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const table = JSON.parse(fs.readFileSync(fname));
      const rows = table[tableName];

      const foundRows = rows.filter(
        (row) =>
          row.hasOwnProperty(field) &&
          row[field]
            .toString()
            .toLowerCase()
            .includes(keyword.toString().toLowerCase())
      );

      callback(true, foundRows);
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
 * Delete a row specified.
 * @param {string} tableName - Table name
 * @param {object} where - Object specifying the conditions for deletion
 * @param {Function} callback - Callback function
 */
function deleteOne(tableName, where, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const table = JSON.parse(fs.readFileSync(fname));
      const rows = table[tableName];

      const updatedRows = rows.filter(
        (row) =>
          !Object.entries(where).every(([key, value]) => row[key] === value)
      );

      if (updatedRows.length === rows.length) {
        callback(false, "Row does not exist!");
        return;
      }

      table[tableName] = updatedRows;

      fs.writeFileSync(fname, JSON.stringify(table, null, 2), (err) => {});
      callback(true, "Row deleted successfully!");
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
 * Delete multiple rows specified.
 * @param {string} tableName - Table name
 * @param {object} conditions - Object specifying the conditions for deletion
 * @param {Function} callback - Callback function
 */
function deleteMany(tableName, conditions, callback) {
  const fname = path.join(userData, tableName + ".json");

  const exists = fs.existsSync(fname);

  if (exists) {
    try {
      const table = JSON.parse(fs.readFileSync(fname));
      const rows = table[tableName];

      const matchedIndices = rows.reduce((indices, row, index) => {
        const isMatched = Object.entries(conditions).every(
          ([key, value]) => row.hasOwnProperty(key) && row[key] === value
        );

        if (isMatched) {
          indices.push(index);
        }

        return indices;
      }, []);

      if (matchedIndices.length === 0) {
        callback(false, "No matching rows found!");
        return;
      }

      for (let k = matchedIndices.length - 1; k >= 0; k--) {
        rows.splice(matchedIndices[k], 1);
      }

      // Update the existing table with the modified rows
      table[tableName] = rows;

      // Write the object to json file
      fs.writeFileSync(fname, JSON.stringify(table, null, 2), (err) => {});

      callback(true, "Rows deleted successfully!");
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
 * Check table existence
 * @param {string} dbName - Table name
 * @param {string} dbLocation - Location of the database
 * @return {boolean} - Result of existence check
 */
function exists(dbName, dbLocation) {
  const fName = path.join(dbLocation, dbName + ".json");
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
