import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomerAccountDetailComponent } from './customer-account-detail.component';

describe('CustomerAccount Management Detail Component', () => {
  let comp: CustomerAccountDetailComponent;
  let fixture: ComponentFixture<CustomerAccountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAccountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ customerAccount: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CustomerAccountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CustomerAccountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load customerAccount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.customerAccount).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
