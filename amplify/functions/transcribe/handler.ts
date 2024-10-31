import AWS from 'aws-sdk';
import type { Handler } from 'aws-lambda';

const s3 = new AWS.S3();
const transcribe = new AWS.TranscribeService();

export const handler: Handler = async (event, context) => {
    const bucketName = process.env.STORAGE_BUCKET_NAME;
    if (!bucketName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bucket name is not defined in environment variables' })
        };
    }

    const { audioFileKey, languageCode } = JSON.parse(event.body);
    if (!audioFileKey) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Audio file key is missing' })
        };
    }

    const jobName = `transcription_${Date.now()}`;

    const jobParams = {
        TranscriptionJobName: jobName,
        LanguageCode: languageCode || 'es-ES',
        Media: {
            MediaFileUri: `s3://${bucketName}/${audioFileKey}`
        },
        OutputBucketName: bucketName
    };

    await transcribe.startTranscriptionJob(jobParams).promise();

    let jobData;
    while (true) {
        jobData = await transcribe.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();
        if (jobData.TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED') {
            break;
        }
        await new Promise(res => setTimeout(res, 5000));
    }

    const transcriptKey = `${jobName}.json`;
    const transcriptData = await s3.getObject({
        Bucket: bucketName,
        Key: transcriptKey
    }).promise();

    if (!transcriptData.Body) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Transcript data is missing' })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(transcriptData.Body.toString('utf-8'))
    };
};
