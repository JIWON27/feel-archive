package com.feelarchive.domain.capsule.repository;

import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeCapsuleRepository extends JpaRepository<TimeCapsule, Long> {

  @Query("SELECT t FROM TimeCapsule t WHERE t.capsuleStatus = :status and t.openAt <= :time")
  Slice<TimeCapsule> findPendingCapsules(
      @Param("status") CapsuleStatus status,
      @Param("time") LocalDateTime time,
      Pageable pageable);
}
