# Web Deployment Guide

This README provides step-by-step instructions to build and deploy your Expo React Native web application to Surge.sh.

## Deployment Process

Follow these steps to deploy your application to the web:

### 1. Build the Web Application

First, export your Expo project for web deployment:

```shell script
npx expo export --platform web
```

This command builds your project and creates a `dist` directory containing all the necessary files for web deployment.

### 2. Navigate to the Build Directory

Change to the distribution directory:

```shell script
cd ./dist/
```

### 3. Create a SPA Fallback Page

For single-page applications (SPAs), create a fallback page to handle client-side routing:

```shell script
cp index.html 200.html
```

This copies your main HTML file to a file named `200.html`, which Surge uses to serve the correct content regardless of
the URL path.

### 4. Deploy to Surge

Deploy your application to Surge:

```shell script
npx surge
```

When prompted:

- Enter your domain as: `neuer-standart.surge.sh`
- Sign in with your Surge account (or create one if needed)

## Notes

- The deployment process takes a few minutes to complete
- After deployment, your application will be available at `https://neuer-standart.surge.sh`
- If you encounter any issues with fonts or assets, ensure they are properly included in your build configuration

## Troubleshooting

If you encounter issues with missing assets or 404 errors:

1. Check that all assets are properly imported in your application
2. Verify that your routing configuration is correct
3. Make sure any required environment variables are set correctly

## Updating Your Deployment

To update your deployment, simply repeat the steps above. Surge will overwrite the previous deployment with your new
build.