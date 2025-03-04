const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('./db');

// Register User
router.post('/register', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { username, password, email } = req.body;
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Password', sql.NVarChar, password)
            .input('Email', sql.NVarChar, email)
            .query('INSERT INTO Users (Username, Password, Email) VALUES (@Username, @Password, @Email)');
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { username, password } = req.body;
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Password', sql.NVarChar, password)
            .query('SELECT * FROM Users WHERE Username = @Username AND Password = @Password');
        if (result.recordset.length > 0) {
            res.status(200).send(result.recordset[0]);
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get Transactions for a User
router.get('/transactions/:userId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { userId } = req.params;
        const result = await pool.request()
            .input('UserId', sql.UniqueIdentifier, userId)
            .query(`SELECT t.*, c.Name as CategoryName, c.Type as CategoryType FROM Transactions t JOIN Categories c ON t.CategoryId = c.Id WHERE t.UserId = @UserId`);
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get Categories for a User
router.get('/categories/:userId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { userId } = req.params;
        const result = await pool.request()
            .input('UserId', sql.UniqueIdentifier, userId)
            .query(`SELECT * FROM Categories WHERE UserId = @UserId`);
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add Transaction
router.post('/transactions', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { userId, categoryId, amount, description } = req.body;
        const result = await pool.request()
            .input('UserId', sql.UniqueIdentifier, userId)
            .input('CategoryId', sql.UniqueIdentifier, categoryId)
            .input('Amount', sql.Decimal, amount)
            .input('Description', sql.NVarChar, description)
            .query('INSERT INTO Transactions (UserId, CategoryId, Amount, Description) VALUES (@UserId, @CategoryId, @Amount, @Description)');
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Edit Transaction
router.put('/transactions/:transactionId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { transactionId } = req.params;
        const { categoryId, amount, description } = req.body;
        const result = await pool.request()
            .input('TransactionId', sql.UniqueIdentifier, transactionId)
            .input('Amount', sql.Decimal, amount)
            .input('Description', sql.NVarChar, description)
            .query('UPDATE Transactions SET Amount = @Amount, Description = @Description WHERE Id = @TransactionId');
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete Transaction
router.delete('/transactions/:transactionId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { transactionId } = req.params;
        const result = await pool.request()
            .input('TransactionId', sql.UniqueIdentifier, transactionId)
            .query('DELETE FROM Transactions WHERE Id = @TransactionId');
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add Category
router.post('/categories', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { name, type, userId } = req.body;
        const result = await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Type', sql.NVarChar, type)
            .input('UserId', sql.UniqueIdentifier, userId)
            .query('INSERT INTO Categories (Name, Type, UserId) VALUES (@Name, @Type, @UserId)');
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete Category
router.delete('/categories/:categoryId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { categoryId } = req.params;
        const result = await pool.request()
            .input('CategoryId', sql.UniqueIdentifier, categoryId)
            .query('DELETE FROM Categories WHERE Id = @CategoryId');
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;