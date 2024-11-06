import { useState, useEffect, ChangeEvent } from 'react';
import { uploadData } from '@aws-amplify/storage'; // Utilizamos uploadData
import '../configureAmplify';
import AuthWrapper from './../components/AuthWrapper';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

interface Todo {
  id: string;
  content: string | null; // Ajuste para permitir null
  createdAt: string;
  updatedAt: string;
}

const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [transcription, setTranscription] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

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
              data: event.target.result,
              path: file.name,
              options: {
                contentType: file.type,
                bucket: 'amplifyTeamDrive'  // Especifica el bucket aquí
              }
            });
            console.log('File uploaded successfully');

            const response = await fetch('https://xez5wgjcrh.execute-api.sa-east-1.amazonaws.com/dev/transcribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                audioFileKey: file.name,
                languageCode: 'es-ES'
              })
            });

            const data = await response.json();
            console.log("Transcription API Response:", data); // Registro de la respuesta de la API

            // Verificar si data.body es una cadena JSON y analizarlo si es necesario
            const parsedData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
            if (parsedData.transcripts) {
              setTranscription(parsedData.transcripts[0].transcript);
            } else {
              console.error("Transcription data is not in the expected format", parsedData);
            }
          } catch (error) {
            console.log("error", error);
          }
        } else {
          console.log('Error: event.target.result is undefined');
        }
      };
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await client.models.Todo.list();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <AuthWrapper>
      <div>
        <input title="file" type="file" onChange={pickFile} />
        <button onClick={uploadFile}>Upload and Transcribe</button>
      </div>
      {uploadProgress !== null && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
      {transcription && (
        <div>
          <h2>Transcription</h2>
          <pre>{transcription}</pre>
        </div>
      )}
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.content}</li>)}
      </ul>
    </AuthWrapper>
  );
};

export default HomePage;
