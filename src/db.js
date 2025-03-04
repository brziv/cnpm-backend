const sql = require('mssql');

const config = {
    user: 'brziv',
    password: 'tnehm',
    server: 'GAMMA\\SQLEXPRESS',
    database: 'Finance_Real',
    options: {
        trustServerCertificate: true,
        encrypt: false,
    },
    port: 1433
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
    sql, poolPromise
};