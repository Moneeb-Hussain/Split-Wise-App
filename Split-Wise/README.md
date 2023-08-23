# Split Wise

SplitWise is an application primarily developed to experience effortless expense sharing and simplified bill splitting. Users can easily manage group expenses, split bills, and foster financial harmony. 

## Features

- User authentication: Users can log in to the application using their credentials.
- Expense creation: Users can create expenses with other available users.
- Expense details: Each expense includes a description, total bill amount, image of the bill, date of expense, and a breakdown of who pays how much.
- Report generation: The application calculates and generates a report to determine how much each user owes.
- Expense settlement: Users can mark expenses as settled after paying their respective amounts.
- Responsive UI: The application is built with responsive design using Material-UI, ensuring a consistent user experience across different devices.

## Technologies and Frameworks

- **React:** Advanced frontend library for constructing dynamic user interfaces.
- **Firebase:** Robust Backend-as-a-Service (BaaS) platform offering authentication, real-time database, and cloud storage.
**React Router:** [React Router](https://reactrouter.com/) is a popular routing library for React applications.
- **Vite:** Modern build tool focused on speed and efficiency for frontend development.
- **Material-UI:** UI component framework for consistent, high-quality design.

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm (>=7.x)

## Environment Variables

Create a `.env` file in the root directory of the project based on the `.env.sample` provided. This file should contain your Firebase configuration details:


## Adding a Router

Create React App doesn't prescribe a specific routing solution, but [React Router](https://reacttraining.com/react-router/) is the most popular one.

To add it, run:

```sh
npm install react-router-dom
```
### Material-UI

Material-UI is a widely-used UI component library for React that follows Google's Material Design guidelines. It provides a set of pre-designed components and styles that enable developers to create visually appealing and responsive user interfaces with ease.

### Adding Material-UI

To add [Material-UI](https://mui.com/) to your project, run the following npm command:

```sh
npm install @mui/material @emotion/react @emotion/styled
```

### Integrating Firebase DataBase

To integrate [Firebase](https://firebase.google.com/) into your project, follow these steps:

1. **Create Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Get Configuration:** In your Firebase project settings, locate the web app configuration. You'll need the configuration object containing API keys, authentication settings, and other details.

3. **Environment Variables:** Create a `.env` file in your project's root directory and populate it with the Firebase configuration details, as shown in the `.env.sample` file.

4. **Installing Firebase:** Install the Firebase JavaScript SDK using the following npm command:

   ```sh
   npm install firebase


## Development

1. **Installing Dependencies:**

   ```bash
   npm install

2. **Running Development Server:**

   ```bash
   npm run dev
