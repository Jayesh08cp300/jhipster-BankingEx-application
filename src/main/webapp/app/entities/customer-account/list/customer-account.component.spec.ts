import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CustomerAccountService } from '../service/customer-account.service';

import { CustomerAccountComponent } from './customer-account.component';

describe('CustomerAccount Management Component', () => {
  let comp: CustomerAccountComponent;
  let fixture: ComponentFixture<CustomerAccountComponent>;
  let service: CustomerAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CustomerAccountComponent],
    })
      .overrideTemplate(CustomerAccountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerAccountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CustomerAccountService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.customerAccounts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
