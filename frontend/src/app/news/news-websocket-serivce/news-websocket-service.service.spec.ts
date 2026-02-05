import { TestBed } from '@angular/core/testing';

import { NewsWebsocketServiceService } from './news-websocket-service.service';

describe('NewsWebsocketServiceService', () => {
  let service: NewsWebsocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsWebsocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
