# CSV Parser application for Coding Ninja

This is a sample csv parser application. The application parses `.csv` files and stores the file contents
in database for future browsing. This application renders a `.csv` file in a tabular format while it also
provides functionality for searching, sorting and paging.

## Install Application

In the project directory, you need to run:

### `npm install`

This will install all the dependencies and dev-dependencies. Then set all the required environment
variables for the project to run. To view all the environment variables, view the  `src/config/environment.ts`
file. You will get an idea of which variables to set.

### `npm run build`
After setting up the environment variables, finally run this command to compile the application.

### `npm run prod`
Lastly, run this command to start the application. The application will start and at specified port,
(for specifying port, set the `PORT` environment variable) it will listen for incoming requests.