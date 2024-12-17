# Genus WFM Server Setup Guide

Follow these steps to set up the Genus WFM server on your machine.

1. **Install Git CLI**

    If you don't have Git installed, you can install it by following the instructions on the official Git website: [Git - Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

2. **Generate SSH Keys**

    If you haven't created SSH keys before, generate them using the following command:

    ```bash
    ssh-keygen -t ed25519 -C "server-name"
    ```

3. **Copy SSH Keys to Git Repository**

    Copy the newly generated SSH keys into the deploy keys in the Git repository. Obtain the public key using:

    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```

    Add this public key to the deploy keys section of your Git repository.

4. **Navigate to /srv Directory**

    Change into the `/srv` directory:

    ```bash
    cd /srv
    ```

5. **Create Genus WFM Directory**

    Create a directory named `genus-wfm`:

    ```bash
    sudo mkdir genus-wfm
    ```

6. **Set Permissions**

    If deploying for a specific user, allow permissions for that user:

    ```bash
    sudo chown -R $USER:$USER genus-wfm
    ```

7. **Clone the Codebase**

    Clone the Genus WFM codebase from the Git repository:

    ```bash
    git clone git@github.com:habilelabs/genus-wfm.git genus-wfm
    ```

8. **Navigate to Project Directory**

    Change into the project directory:

    ```bash
    cd genus-wfm
    ```

9. **Checkout Dedicated Branch**

    Checkout to the dedicated branch (pre-prod or main) for testing purposes. Use `pre-prod` for testing and `main` for the live server:

    ```bash
    git checkout branch-name
    ```

10. **Copy Environment Configuration**

    Copy the `.env.example` file into a new `.env` file:

    ```bash
    cp backend/.env.example backend/.env
    ```

11. **Install Dependencies**

    Run the provided `initial-setup.sh` script to install all required dependencies:

    ```bash
    ./initial-setup.sh
    ```

## Metabase Setup

12. **Set UP `metabase` for reports and dashboard**
    a. Create alish for metabse to Pull docker image and start the container
    ```bash
    echo "# alias to run metabase" >> ~/.bashrc
    echo "alias metabasedocker='docker system prune -f && docker run -d --network=host -v /srv/genus-wfm/metabase-data/metabase.db:/metabase.db -v /srv/genus-wfm/metabase-data/data:/metabase-data --name metabase metabase/metabase'"  >> ~/.bashrc
    ```
    b. Reload the updated bashrc profile:

    ```bash
    source ~/.bashrc
    ```

    c. Start the container via
    ```bash
    metabasedocker
    ```

    d. In future if you want to restart the contianer then it should first remove the old container for that you can run
    ```bash
    docker system prune -f
    ```

13. **Set `NODE_ENV` Variable to Production**

    Set the `NODE_ENV` variable to production using the following command:

    ```bash
    sed -i 's/NODE_ENV=development/NODE_ENV=production/g' backend/.env
    ```

14. **Set `DB_PORT` Variable to point pgbouncer**

    Set the `DB_PORT` variable to 6432 using the following command:

    ```bash
    sed -i 's/DB_PORT=5432/DB_PORT=6432/g' backend/.env
    ```

15. **Run Deployment Script**

    To initiate the deployments and reload the server with the latest changes, run the `deploy.sh` script again:

    ```bash
    ./deploy.sh
    ```

16. **Start Nginx Load Balancer**
    a. First of all get SSL from service provider, and place them inside `/srv/genus-wfm/ssl-certs` directory. ssl_certificate should be placed with `fullchain.crt` name and key should be placed under `private.key` name.

    b. Then execute the `nginx-setup.sh` script `Replace 'domain_name' with your actual domain name` and `Replace 'reports_domain_name' with your reports and dashboard domain`

    ```bash
    ./nginx-setup.sh domain_name reports_domain_name
    ```

    c. Update git index for `genus-wfm-nginx.conf` to not consider this file for any change
    ```bash
    git update-index --assume-unchanged genus-wfm-nginx.conf
    ```

17. **Configure Google Recaptcha for Captcha Verification**
    `Ask the system administrator to add your domain to Google Recaptcha verifications to enable captcha verification for your domain.`

## Project Information

- Backend server code is located inside the `backend` folder.
- Web server code is inside the `frontend` folder.
- Mobile application (React Native) code is located inside the `mobileApp` folder.

Logs can be found inside the `backend/logs` folder.

You have successfully set up the Genus WFM server. Refer to the documentation or specific instructions in the project repository for additional configuration and usage details.

Feel free to reach out if you encounter any issues or have questions during the setup process. Happy coding!
