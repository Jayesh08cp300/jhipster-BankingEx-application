package com.pmc.bankapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bank.
 */
@Entity
@Table(name = "bank")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bank implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "transaction_charge")
    private Float transactionCharge;

    @OneToMany(mappedBy = "bank")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "bank", "customer" }, allowSetters = true)
    private Set<CustomerAccount> customerAccounts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bank id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBankName() {
        return this.bankName;
    }

    public Bank bankName(String bankName) {
        this.setBankName(bankName);
        return this;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Float getTransactionCharge() {
        return this.transactionCharge;
    }

    public Bank transactionCharge(Float transactionCharge) {
        this.setTransactionCharge(transactionCharge);
        return this;
    }

    public void setTransactionCharge(Float transactionCharge) {
        this.transactionCharge = transactionCharge;
    }

    public Set<CustomerAccount> getCustomerAccounts() {
        return this.customerAccounts;
    }

    public void setCustomerAccounts(Set<CustomerAccount> customerAccounts) {
        if (this.customerAccounts != null) {
            this.customerAccounts.forEach(i -> i.setBank(null));
        }
        if (customerAccounts != null) {
            customerAccounts.forEach(i -> i.setBank(this));
        }
        this.customerAccounts = customerAccounts;
    }

    public Bank customerAccounts(Set<CustomerAccount> customerAccounts) {
        this.setCustomerAccounts(customerAccounts);
        return this;
    }

    public Bank addCustomerAccount(CustomerAccount customerAccount) {
        this.customerAccounts.add(customerAccount);
        customerAccount.setBank(this);
        return this;
    }

    public Bank removeCustomerAccount(CustomerAccount customerAccount) {
        this.customerAccounts.remove(customerAccount);
        customerAccount.setBank(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bank)) {
            return false;
        }
        return id != null && id.equals(((Bank) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bank{" +
            "id=" + getId() +
            ", bankName='" + getBankName() + "'" +
            ", transactionCharge=" + getTransactionCharge() +
            "}";
    }
}
