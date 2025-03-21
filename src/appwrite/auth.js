import { Client, Account, ID, Databases } from 'appwrite'

export class AuthService {
  client = new Client();
  account;
  database;

  constructor() {
    const url = import.meta.env.VITE_APPWRITE_URL;
   const proid =  import.meta.env.VITE_PROJECT_ID;

    this.client
      .setEndpoint(url)
      .setProject(proid);

    this.account = new Account(this.client);

    // Initialize the Database instance (adjust the configuration as needed)
    this.database = new Databases(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      // Generate a unique ID for the account
      const uniqueId = ID.unique();
      console.log("Generated userId:", uniqueId);

      // Create the account using the generated uniqueId
      const userAccount = await this.account.create(uniqueId, email, password, name);

      if (userAccount) {
        // Extract the generated userId from the account object.
        // It might be in userAccount.$id or userAccount.id depending on your SDK version.
        const generatedUserId = userAccount.$id || userAccount.id;
        console.log("Created account with userId:", generatedUserId);


        await this.database.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          "67cc5ee10028552ca47c",
          ID.unique(), // or "unique()"
          { user_id: generatedUserId }
        );

        // Proceed to login after account creation
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      // Optionally, handle or ignore the specific error as needed
      if (error.message.includes("Invalid userId param")) {
        console.warn("Ignoring Invalid userId error and continuing...");
        return this.login({ email, password });
      }
      throw error;
    }
  }

async login({ email, password }) {
  try {
    // Check if the user is logged in before deleting sessions
    const user = await this.getCurrentUser();
    if (user) {
      await this.account.deleteSessions(); 
    }

    // Create a new session
    return await this.account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}



  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }
    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }

  async checkAuthStatus() {
        try {
            const user = await this.account.get();
            return user; // Returns user details if authenticated
        } catch (error) {
            console.log("User not authenticated", error);
            return null; // No user logged in
        }
    }
}

const authService = new AuthService();
export default authService;