package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MajorRepository extends JpaRepository<Major, String> {
    boolean existsByFaculty_Code(String facultyCode);

    List<Major> findAllByFaculty_Code(String facultyCode, Sort sort);
}
