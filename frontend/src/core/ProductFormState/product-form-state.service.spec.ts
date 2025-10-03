import { TestBed } from '@angular/core/testing';

import { ProductFormStateService } from './product-form-state.service';

describe('ProductFormStateService', () => {
  let service: ProductFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
