# Connecting to the DVC Repository

## Steps to Configure DVC with Azure Blob Storage

1. **Add a Remote Storage**
   
   Use the following command to add and set a default remote storage:
   ```bash
   dvc remote add -d myremote azure://<blob storage>
   ```
   Replace `<blob storage>` with the appropriate path to your Azure Blob Storage container.

2. **Modify Remote Storage with Account Details**

   Update the remote storage configuration with your Azure Storage account details:
   
   - Set the storage account name:
     ```bash
     dvc remote modify myremote account_name <storage account name>
     ```
     Replace `<storage account name>` with your actual Azure Storage account name.

   - Set the storage account key:
     ```bash
     dvc remote modify myremote account_key <storage account key>
     ```
     Replace `<storage account key>` with the key associated with your Azure Storage account.

## Need update for the missing infos
