package com.feelarchive.domain.capsule.repository;

import com.feelarchive.domain.capsule.entity.TimeCapsule;
import com.feelarchive.domain.capsule.entity.TimeCapsuleImage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeCapsuleImageRepository extends JpaRepository<TimeCapsuleImage, Long> {
  Optional<TimeCapsuleImage> findByIdAndTimeCapsule_Id(Long id, Long timeCapsuleId);
  List<TimeCapsuleImage> findByTimeCapsule(TimeCapsule timeCapsule);
}
