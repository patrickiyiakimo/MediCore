const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    // Destructure the request body to get the user details
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;

    if ( !firstName || !lastName || !email ||!phoneNumber, !password, !confirmPassword ){

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

        const userId = newUser.rows[0].UUID;

            // Create tokens
            const accessToken = jwt.sign(

            { UUID: userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }

            );

            const refreshToken = jwt.sign(

            { UUID: userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }

            );

            // Set cookies
            res.cookie("access_token", accessToken, {

            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // secure: false,          // disable secure locally for testing
            sameSite: "strict",
            maxAge: 15 * 60 * 1000

            });

            res.cookie("refresh_token", refreshToken, {

            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // secure: false,          // disable secure locally for testing
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000

            });

    res.status(201).json({
      message: "User registered successfully",
      data: newUser.rows[0]
    });
    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" });

    }
}