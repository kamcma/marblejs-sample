## Prerequisites
- Docker
- Visual Studio Code with Remote - Containers extension
- optionally, pre-download the development container image with `docker pull node:current`

## To run

1. Open a new Visual Studio Code window. Open the command palette and run **Remote-Containers: Open Repository in Container...**. Enter `kamcma/marblejs-sample` in the text field that appears and hit Enter. Cloning the source repository, pulling the development image and building the development container may take several minutes.
2. Open the integrated terminal. This shell is in the development container. Enter the command `npm run start:dev`. Building the application and launching the development server will take a moment. The app is ready when it logs that it is listening on port 8080.
3. Open a browser on the Docker host machine and navigate to `localhost:8080/api/v1/users/` or `localhost:8080/api/v1/users/1`.
4. In the integrated terminal, enter Ctrl+C to shut down the development server.
5. Close the Visual Studio Code workspace and Visual Studio Code will stop the development container.
