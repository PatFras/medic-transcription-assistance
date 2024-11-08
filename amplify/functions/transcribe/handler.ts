interface TranscriptionEvent {
  userId: string;
  audioFileBase64: string;
  transcription?: string;
  status: string;
}

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: TranscriptionEvent) => {
  const { userId, audioFileBase64, transcription = "", status } = event;
  const uploadTimestamp = new Date().toISOString();

  const params = {
      TableName: 'UserTranscriptions',
      Item: {
          UserId: userId,
          UploadTimestamp: uploadTimestamp,
          AudioFileBase64: audioFileBase64, // Audio en formato Base64
          Transcription: transcription,
          Status: status
      }
  };

  try {
      await dynamodb.put(params).promise();
      return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Data stored successfully' })
      };
  } catch (error) {
      console.error(error);
      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed to store data' })
      };
  }
};
