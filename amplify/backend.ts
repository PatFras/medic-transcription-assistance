import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import {transcribe} from "./functions/transcribe/resource";

defineBackend({
  auth,
  data,
  storage,
  transcribe,
});
