import { Injectable, Inject } from '@angular/core';
import { InlineSVGConfig } from 'ng-inline-svg';
 
@Injectable()
export class SVGConfig extends InlineSVGConfig {
  // Do what ever conditions you need to set this, e.g. checking for server-side rendering
  // and only set baseURL when server-side rendered if you want.
 
  constructor() {
    super();
 
    // When the server-side rendered app runs on localhost:3000, make sure baseURL is
    // http://localhost:3000 and make sure the Express server is configured properly to 
    // allow the URL of the asset folders storing the SVG files.
    // this.baseUrl = 'https://foodforlife.com.ua/storage/';
 
    // If you don't want the directive to run on the server side.
    this.clientOnly = true;
 
    // If you want to bypass your HttpClient interceptor chain when fetching SVGs.
    this.bypassHttpClientInterceptorChain = true;
  }
}