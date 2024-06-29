let correctNumber;
let attemptsLeft;
let loggedInUser;
let userBalance = 0; // Initialize user balance at 0

function showRegister() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (email && password) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email]) {
            alert('Email already exists. Please choose another.');
        } else {
            users[email] = { password: password, balance: 0 }; // Store balance along with password
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please log in.');
            showLogin();
        }
    } else {
        alert('Please enter both email and password.');
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email] && users[email].password === password) {
            loggedInUser = email;
            userBalance = users[email].balance; // Set user balance from localStorage

            // Set infinite balance for specific user
            if (email === 'rachiddhaybi852005@gmail.com') {
                userBalance = Infinity;
            }

            document.getElementById('login-container').style.display = 'none';
            document.getElementById('register-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            startGame();
        } else {
            alert('Invalid email or password.');
        }
    } else {
        alert('Please enter both email and password.');
    }
}

function startGame() {
    correctNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 5;
    document.getElementById('message').textContent = 'Guess a number between 1 and 100';
    document.getElementById('result').textContent = `You have ${attemptsLeft} attempts left.`;
    document.getElementById('guess').value = '';
}

function checkGuess() {
    const guess = parseInt(document.getElementById('guess').value);
    if (guess > 0 && guess <= 100) {
        attemptsLeft--;
        if (guess === correctNumber) {
            document.getElementById('result').textContent = `🎉 Congratulations ${loggedInUser}, you guessed correctly!`;
            userBalance += 30; // Add 30 units on correct guess
            updateBalance(); // Update displayed balance
            addWinner(loggedInUser);
            startGame();
        } else if (guess > correctNumber) {
            document.getElementById('result').textContent = `📉 Too high! Try again. You have ${attemptsLeft} attempts left.`;
        } else {
            document.getElementById('result').textContent = `📈 Too low! Try again. You have ${attemptsLeft} attempts left.`;
        }
        
        if (attemptsLeft === 0) {
            document.getElementById('result').textContent = `😢 Sorry, ${loggedInUser}. You've used all your attempts. The correct number was ${correctNumber}.`;
            userBalance -= 10; // Deduct 10 units when attempts are exhausted
            updateBalance(); // Update displayed balance
            setTimeout(startGame, 200);
        }
    } else {
        alert('Please enter a number between 1 and 100.');
    }
}

function addWinner(email) {
    const winnersList = document.getElementById('winners-list');
    const listItem = document.createElement('li');
    listItem.textContent = email;
    winnersList.appendChild(listItem);
}

function showBalance() {
    alert(`Your balance: ${userBalance}`);
}

function transferBalance() {
    const recipientEmail = prompt('Enter recipient email:');
    if (recipientEmail) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[recipientEmail]) {
            const amountStr = prompt(`Enter amount to transfer to ${recipientEmail}:`);
            const amount = parseInt(amountStr);
            if (!isNaN(amount) && amount > 0 && amount <= userBalance) {
                users[loggedInUser].balance -= amount;
                users[recipientEmail].balance += amount;
                localStorage.setItem('users', JSON.stringify(users));
                userBalance -= amount; // Update local balance
                alert(`Successfully transferred ${amount} to ${recipientEmail}.`);
                updateBalance(); // Update displayed balance
            } else {
                alert('Invalid amount or insufficient balance.');
            }
        } else {
            alert(`Recipient ${recipientEmail} not found.`);
        }
    }
}

function updateBalance() {
    // Update balance in localStorage for the logged-in user
    let users = JSON.parse(localStorage.getItem('users')) || {};
    users[loggedInUser].balance = userBalance;
    localStorage.setItem('users', JSON.stringify(users));
}
