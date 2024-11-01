import AWS from 'aws-sdk';
import type { Handler } from 'aws-lambda';

const s3 = new AWS.S3();
const transcribe = new AWS.TranscribeService();

export const handler: Handler = async (event, context) => {
    const bucketName = process.env.STORAGE_BUCKET_NAME;
    if (!bucketName) {
        console.log("Bucket name is not defined");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bucket name is not defined in environment variables' })
        };
    }

    const { audioFileKey, languageCode } = JSON.parse(event.body);
    if (!audioFileKey) {
        console.log("Audio file key is missing");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Audio file key is missing' })
        };
    }

    console.log(`Starting transcription job for ${audioFileKey}`);
    const jobName = `transcription_${Date.now()}`;

    const jobParams = {
        TranscriptionJobName: jobName,
        LanguageCode: languageCode || 'es-ES', // Ajusta según tus necesidades
        Media: {
            MediaFileUri: `s3://${bucketName}/${audioFileKey}`
        },
        OutputBucketName: bucketName
    };

    try {
        await transcribe.startTranscriptionJob(jobParams).promise();
    } catch (error) {
        console.log("Error starting transcription job:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error starting transcription job', error })
        };
    }

    let jobData;
    while (true) {
        try {
            jobData = await transcribe.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();
            if (jobData.TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED') {
                break;
            }
        } catch (error) {
            console.log("Error getting transcription job status:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error getting transcription job status', error })
            };
        }
        await new Promise(res => setTimeout(res, 5000));
    }

    console.log(`Transcription job completed: ${JSON.stringify(jobData)}`);
    if (!jobData.TranscriptionJob?.Transcript?.TranscriptFileUri) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Transcript or TranscriptFileUri is missing' })
        };
    }
    
    const transcriptKey = jobData.TranscriptionJob.Transcript.TranscriptFileUri.split('/').pop();
    
    let transcriptData;
    try {
        transcriptData = await s3.getObject({
            Bucket: bucketName,
            Key: transcriptKey || ''
        }).promise();
    } catch (error) {
        console.log("Error getting transcript data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error getting transcript data', error })
        };
    }

    if (!transcriptData.Body) {
        console.log("Transcript data is missing");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Transcript data is missing' })
        };
    }

    console.log("Transcription result:", transcriptData.Body.toString('utf-8'));

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Transcription completed successfully',
            transcript: transcriptData.Body.toString('utf-8')
        })
    };
};
