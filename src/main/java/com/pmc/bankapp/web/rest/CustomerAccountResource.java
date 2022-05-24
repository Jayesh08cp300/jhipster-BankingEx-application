package com.pmc.bankapp.web.rest;

import com.pmc.bankapp.domain.CustomerAccount;
import com.pmc.bankapp.repository.CustomerAccountRepository;
import com.pmc.bankapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.pmc.bankapp.domain.CustomerAccount}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CustomerAccountResource {

    private final Logger log = LoggerFactory.getLogger(CustomerAccountResource.class);

    private static final String ENTITY_NAME = "customerAccount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomerAccountRepository customerAccountRepository;

    public CustomerAccountResource(CustomerAccountRepository customerAccountRepository) {
        this.customerAccountRepository = customerAccountRepository;
    }

    /**
     * {@code POST  /customer-accounts} : Create a new customerAccount.
     *
     * @param customerAccount the customerAccount to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customerAccount, or with status {@code 400 (Bad Request)} if the customerAccount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/customer-accounts")
    public ResponseEntity<CustomerAccount> createCustomerAccount(@RequestBody CustomerAccount customerAccount) throws URISyntaxException {
        log.debug("REST request to save CustomerAccount : {}", customerAccount);
        if (customerAccount.getId() != null) {
            throw new BadRequestAlertException("A new customerAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomerAccount result = customerAccountRepository.save(customerAccount);
        return ResponseEntity
            .created(new URI("/api/customer-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /customer-accounts/:id} : Updates an existing customerAccount.
     *
     * @param id the id of the customerAccount to save.
     * @param customerAccount the customerAccount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customerAccount,
     * or with status {@code 400 (Bad Request)} if the customerAccount is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customerAccount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/customer-accounts/{id}")
    public ResponseEntity<CustomerAccount> updateCustomerAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomerAccount customerAccount
    ) throws URISyntaxException {
        log.debug("REST request to update CustomerAccount : {}, {}", id, customerAccount);
        if (customerAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customerAccount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customerAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CustomerAccount result = customerAccountRepository.save(customerAccount);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, customerAccount.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /customer-accounts/:id} : Partial updates given fields of an existing customerAccount, field will ignore if it is null
     *
     * @param id the id of the customerAccount to save.
     * @param customerAccount the customerAccount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customerAccount,
     * or with status {@code 400 (Bad Request)} if the customerAccount is not valid,
     * or with status {@code 404 (Not Found)} if the customerAccount is not found,
     * or with status {@code 500 (Internal Server Error)} if the customerAccount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/customer-accounts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomerAccount> partialUpdateCustomerAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomerAccount customerAccount
    ) throws URISyntaxException {
        log.debug("REST request to partial update CustomerAccount partially : {}, {}", id, customerAccount);
        if (customerAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customerAccount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customerAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CustomerAccount> result = customerAccountRepository
            .findById(customerAccount.getId())
            .map(existingCustomerAccount -> {
                if (customerAccount.getAccountNo() != null) {
                    existingCustomerAccount.setAccountNo(customerAccount.getAccountNo());
                }
                if (customerAccount.getBalance() != null) {
                    existingCustomerAccount.setBalance(customerAccount.getBalance());
                }

                return existingCustomerAccount;
            })
            .map(customerAccountRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, customerAccount.getId().toString())
        );
    }

    /**
     * {@code GET  /customer-accounts} : get all the customerAccounts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customerAccounts in body.
     */
    @GetMapping("/customer-accounts")
    public List<CustomerAccount> getAllCustomerAccounts() {
        log.debug("REST request to get all CustomerAccounts");
        return customerAccountRepository.findAll();
    }

    /**
     * {@code GET  /customer-accounts/:id} : get the "id" customerAccount.
     *
     * @param id the id of the customerAccount to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customerAccount, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customer-accounts/{id}")
    public ResponseEntity<CustomerAccount> getCustomerAccount(@PathVariable Long id) {
        log.debug("REST request to get CustomerAccount : {}", id);
        Optional<CustomerAccount> customerAccount = customerAccountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(customerAccount);
    }

    /**
     * {@code DELETE  /customer-accounts/:id} : delete the "id" customerAccount.
     *
     * @param id the id of the customerAccount to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/customer-accounts/{id}")
    public ResponseEntity<Void> deleteCustomerAccount(@PathVariable Long id) {
        log.debug("REST request to delete CustomerAccount : {}", id);
        customerAccountRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
