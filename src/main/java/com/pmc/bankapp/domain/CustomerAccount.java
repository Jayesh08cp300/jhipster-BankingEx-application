package com.pmc.bankapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CustomerAccount.
 */
@Entity
@Table(name = "customer_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CustomerAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "account_no")
    private String accountNo;

    @Column(name = "balance")
    private Float balance;

    @OneToMany(mappedBy = "customerAccount")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "customerAccount" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "customerAccounts" }, allowSetters = true)
    private Bank bank;

    @ManyToOne
    @JsonIgnoreProperties(value = { "customerAccounts" }, allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CustomerAccount id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNo() {
        return this.accountNo;
    }

    public CustomerAccount accountNo(String accountNo) {
        this.setAccountNo(accountNo);
        return this;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public Float getBalance() {
        return this.balance;
    }

    public CustomerAccount balance(Float balance) {
        this.setBalance(balance);
        return this;
    }

    public void setBalance(Float balance) {
        this.balance = balance;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setCustomerAccount(null));
        }
        if (transactions != null) {
            transactions.forEach(i -> i.setCustomerAccount(this));
        }
        this.transactions = transactions;
    }

    public CustomerAccount transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public CustomerAccount addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setCustomerAccount(this);
        return this;
    }

    public CustomerAccount removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setCustomerAccount(null);
        return this;
    }

    public Bank getBank() {
        return this.bank;
    }

    public void setBank(Bank bank) {
        this.bank = bank;
    }

    public CustomerAccount bank(Bank bank) {
        this.setBank(bank);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public CustomerAccount customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CustomerAccount)) {
            return false;
        }
        return id != null && id.equals(((CustomerAccount) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CustomerAccount{" +
            "id=" + getId() +
            ", accountNo='" + getAccountNo() + "'" +
            ", balance=" + getBalance() +
            "}";
    }
}
