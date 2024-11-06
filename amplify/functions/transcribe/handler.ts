import AWS from 'aws-sdk';
import type { Handler } from 'aws-lambda';

const transcribe = new AWS.TranscribeService();

export const handler: Handler = async (event, context) => {
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    console.log("Error parsing JSON", e);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({ message: 'Invalid JSON format' })
    };
  }

  const { audioFileKey, languageCode } = requestBody;
  if (!audioFileKey) {
    console.log("Audio file key is missing");
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({ message: 'Audio file key is missing' })
    };
  }

  console.log(`Starting transcription job for ${audioFileKey}`);
  const jobName = `transcription_${Date.now()}`;

  const jobParams = {
    TranscriptionJobName: jobName,
    LanguageCode: languageCode || 'es-ES',
    Media: {
      MediaFileUri: `s3://${process.env.STORAGE_BUCKET_NAME}/${audioFileKey}`
    },
    OutputBucketName: 'https://s3.sa-east-1.amazonaws.com/informe-med'
  };

  try {
  await transcribe.startTranscriptionJob(jobParams).promise();
  const responseBody = JSON.stringify({ message: 'Transcription job started successfully' });
  console.log("Response Body:", responseBody); // Registro de la respuesta
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Max-Age": "3600"
    },
    body: responseBody
  };
} catch (error) {
  console.log("Error starting transcription job:", error);
  const errorBody = JSON.stringify({ message: 'Error starting transcription job', error });
  console.log("Error Body:", errorBody); // Registro del cuerpo de error
  return {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Max-Age": "3600"
    },
    body: errorBody
  };
}};