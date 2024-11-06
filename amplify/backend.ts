import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import {transcribe} from './functions/transcribe/resource';

defineBackend({
  auth,
  data,
  storage,
  transcribe,
});
