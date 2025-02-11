# ArangoDB Docs Toolchain build

## Prerequisites:
-   **docker-compose**
-   **Python 3**

## Migration Wizard:
create a dedicated folder for testing the wizard process.

**Setup**

```
mkdir new-toolchain-test
cd new-tool-chain-test
new-toolchain-test> git clone git@github.com:arangodb/docs.git
new-toolchain-test> git checkout new-hugo-tooling-main
new-toolchain-test> cd docs/
new-toolchain-test/docs> cd migration-tools/migration
new-toolchain-test/docs/migration-tools/migration> ./clean.sh      // This will remove all media and content from a previous migration

new-toolchain-test/docs/migration-tools/migration> pip3 install pyyaml
```


**Execute migration**
```
// Execute the migration
new-toolchain-test/docs/migration-tools/migration> python3 migration.py --src {path to the old toolchain docs with /docs included} --dst {path of the new toolchain included /docs} --arango-main {path   where there is the main arango repository source code, needed to read the docublocks definitions}
```


## Build

### Docker
-   Run the docker-compose services
     ```
    docs/> docker-compose up --build
    ```

This command will spawn some docker containers:
-   docs_site: container with the site content running on hugo serve
-   arangoproxy: the golang webserver running
-   arangodb: the latest docker arango image

The site will be available at **http://0.0.0.0:1313**


### No Docker
-   Build and Start the arangoproxy webserver
    ```
    arangoproxy/cmd> go build -o arangoproxy
    arangoproxy/cmd> ./arangoproxy {flags}
    ```

-   Launch the hugo build command
    ```
    docs/site> hugo
    ```

The static html will be placed under **docs/site/public/**

For development purpose, it is suggested to use the **hugo serve** command for hot reload on changes, the runtime server will be available at **http://localhost:1313/**
