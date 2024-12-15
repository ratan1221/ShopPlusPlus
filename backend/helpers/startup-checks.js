// helpers/startup-checks.js
import { v2 as cloudinary } from 'cloudinary';

export const validateEnvironmentVariables = () => {
    // Required environment variables with descriptive messages
    const requiredEnvVars = {
        'CLOUDINARY_CLOUD_NAME': 'Cloud name from Cloudinary dashboard',
        'CLOUDINARY_API_KEY': 'API Key from Cloudinary dashboard',
        'CLOUDINARY_API_SECRET': 'API Secret from Cloudinary dashboard'
    };

    const missing = [];
    const invalid = [];

    // Check for missing or empty variables
    Object.entries(requiredEnvVars).forEach(([envVar, description]) => {
        if (!process.env[envVar]) {
            missing.push(`${envVar} (${description})`);
        } else if (process.env[envVar].trim() === '') {
            invalid.push(`${envVar} is empty`);
        }
    });

    if (missing.length || invalid.length) {
        console.error('\n❌ Environment Variable Errors:');
        if (missing.length) {
            console.error('\nMissing variables:');
            missing.forEach(msg => console.error(`- ${msg}`));
        }
        if (invalid.length) {
            console.error('\nInvalid variables:');
            invalid.forEach(msg => console.error(`- ${msg}`));
        }
        process.exit(1);
    }

    // Configure and verify Cloudinary
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });

        // Test configuration asynchronously
        cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            { folder: "test" })
            .then(() => {
                console.log('✅ Cloudinary configuration verified');
            })
            .catch(error => {
                console.error('❌ Cloudinary configuration error:', error.message);
                process.exit(1);
            });

    } catch (error) {
        console.error('❌ Cloudinary initialization error:', error.message);
        process.exit(1);
    }

    console.log('✅ Environment variables validated successfully');
};