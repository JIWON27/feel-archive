package com.feelarchive.api.archive.repository;

import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.domain.ArchiveScrap;
import com.feelarchive.api.user.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveScrapRepository extends JpaRepository<ArchiveScrap, Long> {
  Optional<ArchiveScrap> findByUserAndArchive(User user, Archive archive);
  boolean existsByUserAndArchive(User user, Archive archive);
}
