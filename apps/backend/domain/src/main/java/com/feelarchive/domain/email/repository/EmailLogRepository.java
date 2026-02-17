package com.feelarchive.domain.email.repository;

import com.feelarchive.domain.email.entitiy.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {

}
