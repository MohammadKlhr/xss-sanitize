import { RequestHandler } from 'express';

declare function xssSanitize(options?: object): RequestHandler;

export = xssSanitize;