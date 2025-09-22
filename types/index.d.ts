import { RequestHandler } from 'express';

interface XssSanitizeOptions {
  whiteList?: Record<string, string[]>;
  stripIgnoreTag?: boolean;
  stripIgnoreTagBody?: string[];
  onTag?: (...args: any[]) => any;
  onIgnoreTag?: (...args: any[]) => any;
  onIgnoreTagAttr?: (...args: any[]) => any;
  css?: boolean | object;
  safeAttrValue?: (...args: any[]) => any;
  escapeHtml?: boolean;
  safeProtocol?: string[];
  allowCommentTag?: boolean;
  [key: string]: any; // extra options for flexibility
}

interface XssSanitize extends RequestHandler {
  paramSanitize: (options?: XssSanitizeOptions) => RequestHandler;
}

declare const xssSanitize: XssSanitize;

export = xssSanitize;
