# CARA7 - SOH Certificate Application

This project is a Next.js application for managing and generating passport certificates for electric vehicles and batteries. It tracks the State of Health (SOH) of batteries and ensures centralized, secure certificate management.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Project Overview

The application enables the creation and management of SOH certificates for vehicles and batteries, ensuring authenticity and reliability of information through a simple and intuitive interface.

## Features

- Create certificates for batteries and vehicles
- Track the State of Health (SOH) of batteries
- Centralized management of information for each vehicle and battery
- Built with **Next.js** for a fast, secure, and performant application
- Integration with modern tools for database management, navigation, and UI components

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/CARA7org/cara7-soh-certificate.git
cd cara7-soh-certificate
```

2 **Install dependencies**:

```bash
pnpm install
```

3 **Configure environment variables**:

Create a .env.local file at the project root and add the necessary information for application configuration (e.g., database, API keys).

4 **Start the development server**:

```bash
pnpm run dev
```

5 **Access the application**:

Open http://localhost:3000 to see the application in action.

## Usage

- Create a Certificate: Access the interface for creating vehicle or battery certificates and enter the required details.
- Track SOH: View detailed information about battery health.
- Manage Certificates: View or update certificates as needed.

## Project Structure

- **`/pages`**: Contains the main application pages.
- **`/components`**: Includes reusable components.
- **`/lib`**: Modules and utilities.
- **`/public`**: Contains public files, such as images and icons.
- **`/context`**: Web3Auth context.
- **`/hooks`**: Hooks for web3 interactions and sidebar.
- **`/utils`**: web3 utilities functions.
