package com.pmc.bankapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pmc.bankapp.IntegrationTest;
import com.pmc.bankapp.domain.CustomerAccount;
import com.pmc.bankapp.repository.CustomerAccountRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CustomerAccountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CustomerAccountResourceIT {

    private static final String DEFAULT_ACCOUNT_NO = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_NO = "BBBBBBBBBB";

    private static final Float DEFAULT_BALANCE = 1F;
    private static final Float UPDATED_BALANCE = 2F;

    private static final String ENTITY_API_URL = "/api/customer-accounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCustomerAccountMockMvc;

    private CustomerAccount customerAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomerAccount createEntity(EntityManager em) {
        CustomerAccount customerAccount = new CustomerAccount().accountNo(DEFAULT_ACCOUNT_NO).balance(DEFAULT_BALANCE);
        return customerAccount;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomerAccount createUpdatedEntity(EntityManager em) {
        CustomerAccount customerAccount = new CustomerAccount().accountNo(UPDATED_ACCOUNT_NO).balance(UPDATED_BALANCE);
        return customerAccount;
    }

    @BeforeEach
    public void initTest() {
        customerAccount = createEntity(em);
    }

    @Test
    @Transactional
    void createCustomerAccount() throws Exception {
        int databaseSizeBeforeCreate = customerAccountRepository.findAll().size();
        // Create the CustomerAccount
        restCustomerAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isCreated());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeCreate + 1);
        CustomerAccount testCustomerAccount = customerAccountList.get(customerAccountList.size() - 1);
        assertThat(testCustomerAccount.getAccountNo()).isEqualTo(DEFAULT_ACCOUNT_NO);
        assertThat(testCustomerAccount.getBalance()).isEqualTo(DEFAULT_BALANCE);
    }

    @Test
    @Transactional
    void createCustomerAccountWithExistingId() throws Exception {
        // Create the CustomerAccount with an existing ID
        customerAccount.setId(1L);

        int databaseSizeBeforeCreate = customerAccountRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCustomerAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCustomerAccounts() throws Exception {
        // Initialize the database
        customerAccountRepository.saveAndFlush(customerAccount);

        // Get all the customerAccountList
        restCustomerAccountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(customerAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].accountNo").value(hasItem(DEFAULT_ACCOUNT_NO)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())));
    }

    @Test
    @Transactional
    void getCustomerAccount() throws Exception {
        // Initialize the database
        customerAccountRepository.saveAndFlush(customerAccount);

        // Get the customerAccount
        restCustomerAccountMockMvc
            .perform(get(ENTITY_API_URL_ID, customerAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(customerAccount.getId().intValue()))
            .andExpect(jsonPath("$.accountNo").value(DEFAULT_ACCOUNT_NO))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingCustomerAccount() throws Exception {
        // Get the customerAccount
        restCustomerAccountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCustomerAccount() throws Exception {
        // Initialize the database
        customerAccountRepository.saveAndFlush(customerAccount);

        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();

        // Update the customerAccount
        CustomerAccount updatedCustomerAccount = customerAccountRepository.findById(customerAccount.getId()).get();
        // Disconnect from session so that the updates on updatedCustomerAccount are not directly saved in db
        em.detach(updatedCustomerAccount);
        updatedCustomerAccount.accountNo(UPDATED_ACCOUNT_NO).balance(UPDATED_BALANCE);

        restCustomerAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCustomerAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCustomerAccount))
            )
            .andExpect(status().isOk());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
        CustomerAccount testCustomerAccount = customerAccountList.get(customerAccountList.size() - 1);
        assertThat(testCustomerAccount.getAccountNo()).isEqualTo(UPDATED_ACCOUNT_NO);
        assertThat(testCustomerAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
    }

    @Test
    @Transactional
    void putNonExistingCustomerAccount() throws Exception {
        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();
        customerAccount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomerAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, customerAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCustomerAccount() throws Exception {
        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();
        customerAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCustomerAccount() throws Exception {
        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();
        customerAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerAccountMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCustomerAccountWithPatch() throws Exception {
        // Initialize the database
        customerAccountRepository.saveAndFlush(customerAccount);

        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();

        // Update the customerAccount using partial update
        CustomerAccount partialUpdatedCustomerAccount = new CustomerAccount();
        partialUpdatedCustomerAccount.setId(customerAccount.getId());

        partialUpdatedCustomerAccount.balance(UPDATED_BALANCE);

        restCustomerAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomerAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCustomerAccount))
            )
            .andExpect(status().isOk());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
        CustomerAccount testCustomerAccount = customerAccountList.get(customerAccountList.size() - 1);
        assertThat(testCustomerAccount.getAccountNo()).isEqualTo(DEFAULT_ACCOUNT_NO);
        assertThat(testCustomerAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
    }

    @Test
    @Transactional
    void fullUpdateCustomerAccountWithPatch() throws Exception {
        // Initialize the database
        customerAccountRepository.saveAndFlush(customerAccount);

        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();

        // Update the customerAccount using partial update
        CustomerAccount partialUpdatedCustomerAccount = new CustomerAccount();
        partialUpdatedCustomerAccount.setId(customerAccount.getId());

        partialUpdatedCustomerAccount.accountNo(UPDATED_ACCOUNT_NO).balance(UPDATED_BALANCE);

        restCustomerAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomerAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCustomerAccount))
            )
            .andExpect(status().isOk());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
        CustomerAccount testCustomerAccount = customerAccountList.get(customerAccountList.size() - 1);
        assertThat(testCustomerAccount.getAccountNo()).isEqualTo(UPDATED_ACCOUNT_NO);
        assertThat(testCustomerAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
    }

    @Test
    @Transactional
    void patchNonExistingCustomerAccount() throws Exception {
        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();
        customerAccount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomerAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, customerAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCustomerAccount() throws Exception {
        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();
        customerAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCustomerAccount() throws Exception {
        int databaseSizeBeforeUpdate = customerAccountRepository.findAll().size();
        customerAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerAccountMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customerAccount))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomerAccount in the database
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCustomerAccount() throws Exception {
        // Initialize the database
        customerAccountRepository.saveAndFlush(customerAccount);

        int databaseSizeBeforeDelete = customerAccountRepository.findAll().size();

        // Delete the customerAccount
        restCustomerAccountMockMvc
            .perform(delete(ENTITY_API_URL_ID, customerAccount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CustomerAccount> customerAccountList = customerAccountRepository.findAll();
        assertThat(customerAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
