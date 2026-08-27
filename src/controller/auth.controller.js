const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    // Destructure the request body to get the user details
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;

    if ( !firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword ){

        return res.status(400).json({ message: "All fields are required" });

    }

    if (password !== confirmPassword) {

        return res.status(400).json({ message: "Passwords Do Not Match" })

    }

    try {
        // Check if the user already exists in the database
        const userExists = await pool.query(
            "SELECT id FROM users WHERE email = $1", [email]
        );

        if ( userExists.rows.length > 0) {
            return res.status(400).json({ message: "User Already Exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash( password, salt );

        // Insert the new user into the database and return the newly created user's details
        const newUser = await pool.query (

            "INSERT INTO users ( firstName, lastName, email, password ) VALUES ($1, $2, $3, $4 ) RETURNING UUID, firstName, lastName, email", [ firstName, lastName, email, hashedPassword]
        
        )

        res.status(201).json({
        message: "User registered successfully",
        data: newUser.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

module.exports = { registerUser };