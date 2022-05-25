package com.pmc.bankapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.pmc.bankapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CustomerAccountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomerAccount.class);
        CustomerAccount customerAccount1 = new CustomerAccount();
        customerAccount1.setId(1L);
        CustomerAccount customerAccount2 = new CustomerAccount();
        customerAccount2.setId(customerAccount1.getId());
        assertThat(customerAccount1).isEqualTo(customerAccount2);
        customerAccount2.setId(2L);
        assertThat(customerAccount1).isNotEqualTo(customerAccount2);
        customerAccount1.setId(null);
        assertThat(customerAccount1).isNotEqualTo(customerAccount2);
    }
}
