import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { uploadData } from 'aws-amplify/storage';
import awsconfig from '@/amplify_outputs.json';
import { useState, ChangeEvent } from 'react';
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsconfig);

const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          console.log("Complete File read successfully!", event.target.result);
          try {
            await uploadData({
              data: event.target.result as ArrayBuffer,
              path: file.name,
              options: {
                contentType: file.type
              }
            });
            console.log('File uploaded successfully');
          } catch (error) {
            console.log("error", error);
          }
        } else {
          console.log('Error: event.target.result is undefined');
        }
      };
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <div>
            <input title='file' type="file" onChange={pickFile} />
            <button onClick={uploadFile}>Upload and Transcribe</button>
          </div>
          {uploadProgress !== null && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
        </main>
      )}
    </Authenticator>
  );
};

export default HomePage;
