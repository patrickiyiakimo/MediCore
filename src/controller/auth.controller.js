const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// register user
const registerUser = async (req, res) => {

    // Destructure the request body to get the user details
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;

    if ( !firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword ){
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Invalid email or password" })
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

// Login user with remember me functionality
const loginUser = async (req, res) => {
        const { email, password, remember_me } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            // Check if user exists
            const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            
            if (user.rows.length === 0) {
            return res.status(400).json({ message: "User does not exist" });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
            }

            // Set expiration times based on remember_me
            const accessTokenExpiry = "15m"; // Always 15 minutes for access token
            const refreshTokenExpiry = remember_me ? "30d" : "7d"; // 30 days if remembered, 7 days if not
            
            // Convert expiry to milliseconds for cookie maxAge
            const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes in milliseconds
            const refreshTokenMaxAge = remember_me 
            ? 30 * 24 * 60 * 60 * 1000  // 30 days in milliseconds
            : 7 * 24 * 60 * 60 * 1000;   // 7 days in milliseconds

            // Create access token (short-lived)
        const accessToken = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: accessTokenExpiry }
            );

            // Create refresh token with conditional expiration
            const refreshToken = jwt.sign(
            { id: user.rows[0].id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: refreshTokenExpiry }
            );

            // Set access token in HttpOnly cookie
            res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            // secure: false,       // disable secure locally for testing
            sameSite: "strict",
            maxAge: accessTokenMaxAge
        });

            // Set refresh token in HttpOnly cookie with conditional expiry
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            // secure: false,        // disable secure locally for testing
            sameSite: "strict",
            maxAge: refreshTokenMaxAge
        });

        res.status(200).json({
            message: "User logged in successfully",
            data:{
                id: user.rows[0].id,
                firstName: user.rows[0].firstName,
                lastName: user.rows[0].lastName,
                email: user.rows[0].email
            }
        });

        } catch (err) {
            console.error("Login error:", err.message);
            res.status(500).json({ message: "Server error" });
        }
};

//refresh token
const refreshToken = async (req, res) => {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }

        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // Issue new access token
            const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN } // e.g., "15m"
            );

            // Set new access token in HttpOnly cookie
            res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            // secure: false,          // disable secure locally for testing
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
            });
            res.status(200).json({ message: "Access token refreshed" });
        } catch (err) {
            console.error(err.message);
            return res.status(403).json({ message: "Invalid refresh token" });
        }
};

//logout function to clear the refresh token cookie
const logout = async (req, res) => {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict"
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict"
        });
        res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logout
};