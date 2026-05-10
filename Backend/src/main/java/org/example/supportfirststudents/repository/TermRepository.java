package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TermRepository extends JpaRepository<Term, String> {
}

