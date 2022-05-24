package com.pmc.bankapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "address")
    private String address;

    @Column(name = "mobile_no")
    private String mobileNo;

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "bank", "customer" }, allowSetters = true)
    private Set<CustomerAccount> customerAccounts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Customer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return this.fullName;
    }

    public Customer fullName(String fullName) {
        this.setFullName(fullName);
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAddress() {
        return this.address;
    }

    public Customer address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMobileNo() {
        return this.mobileNo;
    }

    public Customer mobileNo(String mobileNo) {
        this.setMobileNo(mobileNo);
        return this;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public Set<CustomerAccount> getCustomerAccounts() {
        return this.customerAccounts;
    }

    public void setCustomerAccounts(Set<CustomerAccount> customerAccounts) {
        if (this.customerAccounts != null) {
            this.customerAccounts.forEach(i -> i.setCustomer(null));
        }
        if (customerAccounts != null) {
            customerAccounts.forEach(i -> i.setCustomer(this));
        }
        this.customerAccounts = customerAccounts;
    }

    public Customer customerAccounts(Set<CustomerAccount> customerAccounts) {
        this.setCustomerAccounts(customerAccounts);
        return this;
    }

    public Customer addCustomerAccount(CustomerAccount customerAccount) {
        this.customerAccounts.add(customerAccount);
        customerAccount.setCustomer(this);
        return this;
    }

    public Customer removeCustomerAccount(CustomerAccount customerAccount) {
        this.customerAccounts.remove(customerAccount);
        customerAccount.setCustomer(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", fullName='" + getFullName() + "'" +
            ", address='" + getAddress() + "'" +
            ", mobileNo='" + getMobileNo() + "'" +
            "}";
    }
}
