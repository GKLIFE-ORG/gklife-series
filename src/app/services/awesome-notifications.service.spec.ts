import { TestBed } from '@angular/core/testing';

import { AwesomeNotificationsService } from './awesome-notifications.service';

describe('AwesomeNotificationsService', () => {
  let service: AwesomeNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwesomeNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
