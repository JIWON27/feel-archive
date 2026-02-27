package com.feelarchive.domain.archive.repository;

import com.feelarchive.domain.archive.entity.ArchiveScrap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveScrapRepository extends JpaRepository<ArchiveScrap, Long> {

  Optional<ArchiveScrap> findByUser_IdAndArchive_Id(Long userId, Long archiveId);
  boolean existsByUser_IdAndArchive_Id(Long userId, Long archiveId);
  @Query("SELECT ap.archive.id FROM ArchiveScrap ap WHERE ap.user.id = :userId and ap.archive.id IN :archiveIds")
  Set<Long> findArchiveIdsByUserIdAndArchiveIdIn(@Param("userId") Long userId, @Param("archiveIds") List<Long> archiveIds);
}
