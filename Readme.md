# User Installation Manual (How to Use)

# First. Install nodejs for windows/mac

### Step 1: Download the .pkg Installer

Click on the “ **macOS Installer** ” option to download the .pkg installer. Make sure you download it to your desired location.

![nodejs](https://github.com/YoungoLee/COM6504-Web/blob/main/nodejs.png)

### Step 2: Run Node.js Installer

Now, your installer is ready to run. However, it will not take your much time. So, let’s explain in detail here.

`*Introduction > Continue License > Select Continue > Agree Installation Type > Install > Authenticate with your Mac to allow the Installation > Install Software Summary > Close*`

![Run_Node_js_Installer_eff96f6ecc](https://github.com/YoungoLee/COM6504-Web/blob/main/Run_Node_js_Installer_eff96f6ecc.png)

### Step 3: Verify Node.js Installation

To verify whether you have properly installed Node.js in your macOS, run the following command in your terminal:

`*node -v node -v // The command we ran - tests the version of Node.js that's currently installed v12.13.0 // The version of Node.js that's installed. It can be some other version.*`



# Second: Download docker container 

1. Download the installer using the download button at the top of the page, or from the [release notes](https://docs.docker.com/desktop/release-notes/).

2. Double-click `Docker Desktop Installer.exe` to run the installer. By default, Docker Desktop is installed at `C:\Program Files\Docker\Docker`.

3. When prompted, ensure the **Use WSL 2 instead of Hyper-V** option on the Configuration page is selected or not depending on your choice of backend.

   If your system only supports one of the two options, you will not be able to select which backend to use.

4. Follow the instructions on the installation wizard to authorize the installer and proceed with the install.

5. When the installation is successful, select **Close** to complete the installation process.

# Third：use mongodb for docker

### Pull the MongoDB Docker Image[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/#pull-the-mongodb-docker-image)

```
docker pull mongodb/mongodb-community-server:latest
```

### Run the Image as a Container[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/#run-the-image-as-a-container)

```
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

# Fourth: run operation:

1.open webstrom termianl and git clone

2.git clone https://github.com/YoungoLee/COM6504-Web.git

3.npm i

4.npm start 

5.open browser : localhost:1234 and localhost:5678 



## Group Memebr:

Yiang Qian:work:Created the overall framework of the plant catalog, then added plant pages, display plant pages, chat pages and depdia pages



Jingyang Li:work:Implemented the back-end logic and offline chat functions of chat and debpdia page 



Hanming Huang:work:Created the plant, user and comment database, recommended database and then implemented the pwa function，it can be installed to application



mingyang Sun:work:Implemented offline indexdb, added plants online and cached them into mongodb, and participated in the offline data implementation of front-end recommendation and chat.



