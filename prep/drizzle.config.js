/*** @type { import("drizzlle-kit").Config} */
export default {
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://prepbot_owner:3ubQvlsKZaU0@ep-withered-cell-a5pl8ne8.us-east-2.aws.neon.tech/prepbot?sslmode=require',
    }
};