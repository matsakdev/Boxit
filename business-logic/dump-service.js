const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const archiver = require('zip-lib');
const dumpService = require("../services/dump-service");
require("dotenv").config();
const backupDirectory = process.env.DATA_DIRECTORY + process.env.BACKUP_DIRECTORY;
const dbName = process.env.MONGO_DB_NAME;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

const mongoDump = async () => {
  const client = new MongoClient(MONGO_CONNECTION_STRING);
  try {
    await client.connect();
    const db = client.db(dbName);
    const backupPath = `${backupDirectory}/${new Date().toISOString()}`;
    fs.mkdirSync(backupPath);

    const collections = await db.listCollections().toArray();

    await createDumpForEachCollection(collections, db, backupPath);

    const zipFilePath = await archiveFolder(backupPath);

    fs.rmdirSync(backupPath, { recursive: true });

    console.log(`Backup archive created successfully: ${zipFilePath}`);
    await dumpService.saveDumpInfo(zipFilePath);
    return zipFilePath;
  } catch (error) {
    console.error("Cannot create dump: ", error);
    throw error;
  } finally {
    await client.close();
  }
};

const createDumpForEachCollection = async (collections, db, backupPath) => {
  for (const collection of collections) {
    const collectionName = collection.name;
    console.log(collectionName);
    const collectionBackupPath = `${backupPath}/${collectionName}.json`;
    const collectionStream = db.collection(collectionName).find().stream();

    const writeStream = fs.createWriteStream(collectionBackupPath);
    let isFirst = true;

    collectionStream.on("data", (doc) => {
      const json = JSON.stringify(doc);
      if (isFirst) {
        writeStream.write(`[${json}`);
        isFirst = false;
      } else {
        writeStream.write(`,${json}`);
      }
    });

    await new Promise((resolve, reject) => {
      collectionStream.on("error", err => {
        reject(new Error(`Error while reading collection ${collectionName}: ${err}`));
      });

      collectionStream.on("end", () => {
        writeStream.end("]");
      });

      writeStream.on("finish", () => {
        console.log(`Backup for collection ${collectionName} created successfully: ${collectionBackupPath}`);
        resolve();
      });

      writeStream.on("error", err => {
        reject(new Error(`Error while creating backup for collection ${collectionName}: ${err}`));
      });
    });
  }
}

const restoreMongoDatabase = async (mongoDumpId) => {
  try {
    // create dump for case when restoring crashed.
    const reserveDump = await mongoDump();
    console.log('reserve dump: ', reserveDump);

    const dumpInfo = await dumpService.getDumpInfo(mongoDumpId);

    const folderForCollection = dumpInfo.path.substring(0, dumpInfo.path.indexOf('.zip'));

    const collections = await getCollectionsFromZipPath(dumpInfo.path, folderForCollection);

    const client = new MongoClient(MONGO_CONNECTION_STRING);
    await client.connect();
    const db = client.db(dbName);
    await db.dropDatabase();

    const dumpStatus = await insertDumpedData(collections, folderForCollection, db);

    if (dumpStatus) {
      fs.rmdirSync(folderForCollection, { recursive: true });
      return {
        status: true,
        reserveDump,
      }
    } else {
      throw new Error('Cannot backup the system now.')
    }
  }
  catch (error) {
    throw error;
  }
}

const getCollectionsFromZipPath = async (zipArchivePath, folderWithCollection) => {
  await archiver.extract(zipArchivePath, folderWithCollection);
  const collections = fs.readdirSync(folderWithCollection);
  console.log(collections);
  return collections;
}

const insertDumpedData = async (collections, folderWithCollection, db) => {
  for (const collection of collections) {
    const collectionName = collection.slice(0, -5); // Remove ".json"
    const filePath = path.join(folderWithCollection, collection);
    const data = fs.readFileSync(filePath, "utf-8");
    let documents = JSON.parse(data);

    if (!Array.isArray(documents)) {
      documents = [documents];
    }

    console.log(documents);

    await db.collection(collectionName).insertMany(documents);
  }
  return true;
}

const archiveFolder = async (dumpPath) => {
  const zipFilePath = `${dumpPath}.zip`;
  await archiver.archiveFolder(dumpPath, zipFilePath);
  return zipFilePath;
}

module.exports = {
  mongoDump,
  restoreMongoDatabase,
};

