import { Client, Databases, ID } from "appwrite";
import { Query } from 'appwrite';

export class Service{
    client = new Client();
    databases;
    
    constructor() {
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
        .setProject(import.meta.env.VITE_PROJECT_ID)
        this.databases = new Databases(this.client);
    }

    async createExpenses(data){
    const id = ID.unique()
      try {
        return await this.databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_EXPENSES,
            id,
            {
        user_id: data.user_id, // Must match Appwrite field name
        expenselimit: data.expenselimit,
        expenditure: data.expenditure,
        title: data.title, // Ensure this exists in Appwrite
      }
        )
      } catch (error) {
        console.log("Error in create expenses", error);
        
      }
    }

   async deleteExpense(expenseId) {
    try {
        await this.databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_EXPENSES,
        expenseId
        );
        console.log("Expense deleted successfully");
    } catch (error) {
        console.log("Error deleting expense", error);
    }
 }
    async read(expenseId) {
        try {
            return await this.databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_EXPENSES,
            expenseId
            );
            
        }catch (error) {
            console.log("Error reading expense", error);
        }
 }
   async readAll(user_id,queries = [
        Query.equal('user_id', user_id)
    ]) {
        try {
            return await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_EXPENSES,
                queries,
            )
        } catch (error) {
            console.log("Error in getPosts", error);
            return false
        }
    }
    async updateExpense(expenseId, data) {
        try {
            return await this.databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_EXPENSES,
                expenseId,
                data
            )
        } catch (error) {
            console.log("Error in update conf", error);
            
        }

    }



}

const service = new Service()

export default service