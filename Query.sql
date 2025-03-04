
CREATE TABLE Users (
		Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		Username NVARCHAR(50) UNIQUE NOT NULL,
		Password NVARCHAR(255) NOT NULL,
		Email NVARCHAR(100) UNIQUE NOT NULL,
		CreatedAt DATETIME DEFAULT GETDATE()
	);

CREATE TABLE Categories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(10) CHECK (Type IN ('Income', 'Expense')) NOT NULL,
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    CategoryId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Categories(Id),
    Amount DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(255),
    Date DATETIME NOT NULL DEFAULT GETDATE()
);

SELECT * FROM Users
SELECT * FROM Categories
SELECT * FROM Transactions
DROP TABLE Transactions
DROP TABLE Categories

-- Insert Users
INSERT INTO Users (Username, Password, Email)
VALUES 
('john', 'pwd1', 'john@example.com'),
('adam', 'pwd2', 'adam@example.com');

-- Fetch User IDs
DECLARE @User1 UNIQUEIDENTIFIER = (SELECT Id FROM Users WHERE Username = 'john');
DECLARE @User2 UNIQUEIDENTIFIER = (SELECT Id FROM Users WHERE Username = 'adam');

-- Insert Categories
INSERT INTO Categories (Name, Type, UserId)
VALUES 
('Salary', 'Income', @User1),
('Freelance', 'Income', @User1),
('Food', 'Expense', @User1),
('Transport', 'Expense', @User1),
('Salary', 'Income', @User2),
('Investment', 'Income', @User2),
('Shopping', 'Expense', @User2),
('Rent', 'Expense', @User2);

-- Fetch Category IDs for User1
DECLARE @Salary1 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Salary' AND UserId = @User1);
DECLARE @Freelance1 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Freelance' AND UserId = @User1);
DECLARE @Food1 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Food' AND UserId = @User1);
DECLARE @Transport1 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Transport' AND UserId = @User1);

-- Fetch Category IDs for User2
DECLARE @Salary2 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Salary' AND UserId = @User2);
DECLARE @Investment2 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Investment' AND UserId = @User2);
DECLARE @Shopping2 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Shopping' AND UserId = @User2);
DECLARE @Rent2 UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Rent' AND UserId = @User2);

-- Insert Transactions for User1
INSERT INTO Transactions (UserId, CategoryId, Amount, Description, Date)
VALUES 
(@User1, @Salary1, 5000.00, 'Monthly Salary', '2025-02-01'),
(@User1, @Freelance1, 1200.00, 'Freelance Project', '2025-02-10'),
(@User1, @Food1, 150.00, 'Groceries', '2025-02-05'),
(@User1, @Transport1, 50.00, 'Bus fare', '2025-02-07'),
(@User1, @Food1, 200.00, 'Dinner out', '2025-02-15'),
(@User1, @Transport1, 30.00, 'Taxi ride', '2025-02-20');

-- Insert Transactions for User2
INSERT INTO Transactions (UserId, CategoryId, Amount, Description, Date)
VALUES 
(@User2, @Salary2, 6000.00, 'Monthly Salary', '2025-02-01'),
(@User2, @Investment2, 800.00, 'Stock Dividends', '2025-02-12'),
(@User2, @Shopping2, 300.00, 'New Clothes', '2025-02-08'),
(@User2, @Rent2, 1000.00, 'Apartment Rent', '2025-02-01'),
(@User2, @Shopping2, 200.00, 'Gadgets', '2025-02-18'),
(@User2, @Rent2, 1000.00, 'Apartment Rent', '2025-03-01');
