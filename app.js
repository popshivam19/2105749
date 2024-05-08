const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let storedNumbers = [];

// Endpoint to fetch numbers from third-party server
app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;

    try {
        const response = await axios.get(`http://localhost:9876/numbers/${2105749}`);
        const numbers = response.data.numbers;

        if (numbers && numbers.length > 0) {
            // Filter out duplicates and add new numbers to storedNumbers
            numbers.forEach(num => {
                if (!storedNumbers.includes(num)) {
                    storedNumbers.push(num);
                    if (storedNumbers.length > WINDOW_SIZE) {
                        storedNumbers.shift(); // Remove oldest number if window size exceeded
                    }
                }
            });

            // Calculate average of numbers matching the window size
            const average = storedNumbers.reduce((acc, curr) => acc + curr, 0) / storedNumbers.length;

            res.json({
                windowPrevState: storedNumbers.slice(0, storedNumbers.length - numbers.length),
                windowCurrState: storedNumbers,
                numbers: numbers,
                avg: average.toFixed(2)
            });
        } else {
            res.status(400).json({ error: 'No numbers received from third-party server' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching numbers from third-party server' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});