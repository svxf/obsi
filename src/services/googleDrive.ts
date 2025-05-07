import { Note } from '../context/AppContext';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive'; // use other scope this one is restricted?

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

export const initializeGoogleDrive = async () => {
  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    await new Promise<void>((resolve) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });
        gapiInited = true;
        resolve();
      });
    });

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '',
    });
    gisInited = true;

    console.log('Google Drive initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    throw error;
  }
};

// get authorization token
const getAuthToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    tokenClient.callback = (resp) => {
      if (resp.error) {
        console.error('Error getting auth token:', resp.error);
        reject(resp);
        return;
      }
      console.log('Successfully obtained auth token');
      resolve(resp.access_token);
    };

    tokenClient.requestAccessToken();
  });
};

// list files from drive
export const listFiles = async (): Promise<Note[]> => {
  try {
    await getAuthToken();
    console.log('Fetching files from Google Drive...');
    
    const allFilesResponse = await gapi.client.drive.files.list({
      pageSize: 100,
      fields: 'files(id, name, mimeType, modifiedTime)',
    });
    
    console.log('All files:', allFilesResponse.result.files);
    
    const response = await gapi.client.drive.files.list({
      pageSize: 100,
      fields: 'files(id, name, mimeType, modifiedTime)',
      q: "mimeType='application/vnd.google-apps.document'",
      orderBy: 'modifiedTime desc',
    });

    console.log('Google Docs files:', response.result.files);

    if (!response.result.files || response.result.files.length === 0) {
      console.log('No Google Docs found');
      return [];
    }

    return response.result.files.map((file) => ({
      id: file.id!,
      title: file.name!,
      content: '', // is fetched when file is opened
      path: file.name!,
      folder: '',
      lastModified: file.modifiedTime!,
    }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// get file content
export const getFileContent = async (fileId: string): Promise<string> => {
  try {
    await getAuthToken();
    console.log('Fetching content for file:', fileId);
    
    const response = await gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}/export`,
      method: 'GET',
      params: {
        mimeType: 'text/plain'
      }
    });

    console.log('File content fetched successfully');
    return response.body;
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
};

// save file content
export const saveFileContent = async (fileId: string, content: string): Promise<void> => {
  try {
    await getAuthToken();
    console.log('Saving content for file:', fileId);
    
    const media = {
      mimeType: 'text/plain',
      body: content,
    };

    await gapi.client.drive.files.update({
      fileId: fileId,
      media: media,
    });

    console.log('File content saved successfully');
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

// create new file
export const createFile = async (title: string, content: string): Promise<Note> => {
  try {
    await getAuthToken();
    console.log('Creating new file:', title);
    
    const fileMetadata = {
      name: title,
      mimeType: 'application/vnd.google-apps.document',
    };

    const media = {
      mimeType: 'text/plain',
      body: content,
    };

    const response = await gapi.client.drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, modifiedTime',
    });

    console.log('File created successfully:', response.result);
    
    return {
      id: response.result.id!,
      title: response.result.name!,
      content: content,
      path: response.result.name!,
      folder: '',
      lastModified: response.result.modifiedTime!,
    };
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}; 