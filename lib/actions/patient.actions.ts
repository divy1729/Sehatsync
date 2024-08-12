"use server";
import { ID, Models, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { InputFile } from "node-appwrite/file";


export const createUser = async (user: CreateUserParams): Promise<Models.User<any> | null> => {
  try {
    // Create a new user
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined, 
      user.name
    );

    return newUser;
  } catch (error: any) {
    if (error?.code === 409) {
      // Check for existing user
      const existingUsers = await users.list([
        Query.equal("email", user.email),
      ]);

      if (existingUsers.total > 0) {
        return existingUsers.users[0];
      }
    }

    console.error("An error occurred while creating a new user:", error);
    return null; 
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};


export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      // Convert Blob to File
      const blobFile = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;
      const fileToUpload = new File([blobFile], fileName, {
        type: blobFile.type,
      });

      // Upload the file
      file = await storage.createFile(BUCKET_ID!, ID.unique(), fileToUpload);
    }

    // Create a new patient document
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return newPatient;
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    return null; // Return null if the patient couldn't be registered
  }
};
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
}

function parseStringify<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

