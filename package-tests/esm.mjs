import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as core from '@taquito/core';
import * as http from '@taquito/http-utils';
import { NetworkError } from '@taquito/core';
import { HttpResponseError } from '@taquito/http-utils';
import checkConsumer from './runtime.cjs';

const require = createRequire(import.meta.url);
const commonCore = require('@taquito/core');
const commonHttp = require('@taquito/http-utils');
assert.equal(NetworkError, commonCore.NetworkError);
assert.equal(HttpResponseError, commonHttp.HttpResponseError);
// Native ESM currently exposes the CommonJS module as its default export.
assert.equal(core.default, commonCore);
assert.equal(http.default, commonHttp);
await checkConsumer(core, http);
