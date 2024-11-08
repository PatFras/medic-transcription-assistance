import { defineData, a, type ClientSchema } from '@aws-amplify/backend';

/* Definir el esquema */
const schema = a.schema({
  Users: a
    .model({
      userId: a.string().required(), // Llave primaria
      email: a.string(),
      name: a.string()
    })
    .authorization((allow: any) => [allow.owner()]), // Autorización para permitir que los propietarios accedan

  UserTranscriptions: a
    .model({
      userId: a.string().required(), // Parte de la llave primaria compuesta
      uploadTimestamp: a.string().required(), // Parte de la llave primaria compuesta
      audioFileBase64: a.string(), // Almacenar el audio en Base64
      transcription: a.string(),
      status: a.string() // Estado de la transcripción (PENDING, COMPLETED, FAILED)
    })
    .authorization((allow: any) => [allow.owner()]) // Autorización para permitir que los propietarios accedan
});

/* Definir la configuración de datos */
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});
