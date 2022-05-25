package com.pmc.bankapp.repository;

import com.pmc.bankapp.domain.Bank;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bank entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {}
