import { Database } from "arangojs";

const db = new Database({
  url: process.env.DB_LINK,
  databaseName: process.env.DB_NAME,
  auth: { username: process.env.DB_USER, password: process.env.DB_PWD },
});

const core_db = new Database({
  url: process.env.DB_LINK,
  databaseName: process.env.CORE_DB_NAME,
  auth: { username: process.env.CORE_DB_USER, password: process.env.DB_PWD },
});


export default {
  db,
  core_db,
};
